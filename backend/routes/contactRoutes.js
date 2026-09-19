const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createContactMessage)
  .get(protect, admin, getAllContactMessages);

router.delete('/:id', protect, admin, deleteContactMessage);

module.exports = router;
