const express = require('express');
const router = express.Router();
const { storeVocabulary, getAllVocabulary, deleteVocabulary, markRevised, getRevisionStats, updateVocabulary } = require('../controllers/vocabularyController');

router.get('/store-vocabulary', storeVocabulary);
router.get('/get-all-vocabulary', getAllVocabulary);
router.get('/revision-stats', getRevisionStats);
router.delete('/delete-vocabulary/:id', deleteVocabulary);
router.post('/mark-revised/:id', markRevised);
router.put('/update-vocabulary/:id', updateVocabulary);

module.exports = router;
