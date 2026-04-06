const mongoose = require('mongoose');

const VocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  englishMeaning: {
    type: String,
    required: true,
  },
  similarWords: {
    type: [String],
    default: [],
  },
  pronunciationAudio: {
    type: String,
    required: true,
  },
  sentences: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vocabulary', VocabularySchema);
