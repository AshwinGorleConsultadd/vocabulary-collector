const axios = require('axios');
const Vocabulary = require('../models/Vocabulary');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const storeVocabulary = async (req, res) => {
  try {
    const { word, sentence } = req.query;

    if (!word) {
      return res.status(400).json({ error: 'Word is required as a query parameter.' });
    }

    // Check if word already exists
    let existingWord = await Vocabulary.findOne({ word: word.toLowerCase() });
    if (existingWord) {
      return res.status(400).json({ error: 'Word already exists in database.' });
    }

    // Step A: Get Hindi meaning
    const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|hi`;
    const translateRes = await axios.get(translateUrl);
    const meaning = translateRes.data.responseData.translatedText;

    // Step B: Get pronunciation audio URL
    const pronunciationAudio = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=tw-ob`;

    // Step C: Generate 3 sentences using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `Generate 3 simple sentences using the word "${word}" that are easy to understand for a beginner. Provide only the sentences as a list, no intro or outro.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the sentences (assuming simple numbered or bulleted list)
    const sentences = text
      .split('\n')
      .map(s => s.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(s => s.length > 0)
      .slice(0, 3);

    // Step D: Store in MongoDB
    const newEntry = new Vocabulary({
      word: word.toLowerCase(),
      meaning,
      pronunciationAudio,
      sentences: sentences.length > 0 ? sentences : [sentence], // Fallback to provided sentence if any error
    });

    await newEntry.save();

    res.status(201).json({
      message: 'Vocabulary stored successfully!',
      data: newEntry
    });
  } catch (error) {
    console.error('Error in storeVocabulary:', error);
    res.status(500).json({ error: 'Failed to process vocabulary.' });
  }
};

const getAllVocabulary = async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find().sort({ createdAt: -1 });
    res.status(200).json(vocabularies);
  } catch (error) {
    console.error('Error in getAllVocabulary:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary.' });
  }
};

module.exports = {
  storeVocabulary,
  getAllVocabulary,
};
