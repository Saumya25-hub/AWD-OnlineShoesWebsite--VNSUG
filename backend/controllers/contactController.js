const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all contact form fields' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({ message: 'Your message has been sent successfully!', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage
};
