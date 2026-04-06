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
    const pronunciationAudio = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=gtx`;

    // Step C: Generate English meaning, sentences, and similar words using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `You are a helpful language tutor. For the word "${word}", provide:
    1. A short, simple definition in English (max 15 words).
    2. Exactly 3 very simple example sentences for a beginner.
    3. A list of 3-5 similar words (synonyms).
    
    Response MUST be strictly in valid JSON format:
    {
      "englishMeaning": "...",
      "sentences": ["...", "...", "..."],
      "similarWords": ["...", "..."]
    }`;
    
    const result = await model.generateContent(prompt);
    let aiData;
    try {
      const cleanText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      aiData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Error parsing Gemini JSON:', parseError);
      aiData = {
        englishMeaning: 'Definition not available.',
        sentences: [sentence || 'Example not available.'],
        similarWords: []
      };
    }

    // Step D: Store in MongoDB
    const newEntry = new Vocabulary({
      word: word.toLowerCase(),
      meaning,
      englishMeaning: aiData.englishMeaning,
      similarWords: aiData.similarWords,
      pronunciationAudio,
      sentences: aiData.sentences,
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

const deleteVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Vocabulary.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Vocabulary not found.' });
    }
    res.status(200).json({ message: 'Deleted successfully!' });
  } catch (error) {
    console.error('Error in deleteVocabulary:', error);
    res.status(500).json({ error: 'Failed to delete vocabulary.' });
  }
};

module.exports = {
  storeVocabulary,
  getAllVocabulary,
  deleteVocabulary,
};
