const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema({
  vocabularyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastRevisedAt: {
    type: Date,
    default: null
  },
  // History of all revision dates (for consistency heatmaps)
  history: [{
    type: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Revision', RevisionSchema);
