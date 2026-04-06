const express = require('express');
const router = express.Router();
const { storeVocabulary, getAllVocabulary, deleteVocabulary } = require('../controllers/vocabularyController');

router.get('/store-vocabulary', storeVocabulary);
router.get('/get-all-vocabulary', getAllVocabulary);
router.delete('/delete-vocabulary/:id', deleteVocabulary);

module.exports = router;
