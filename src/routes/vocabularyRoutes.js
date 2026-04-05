const express = require('express');
const router = express.Router();
const { storeVocabulary, getAllVocabulary } = require('../controllers/vocabularyController');

router.get('/store-vocabulary', storeVocabulary);
router.get('/get-all-vocabulary', getAllVocabulary);

module.exports = router;
