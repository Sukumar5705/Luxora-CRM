const Inquiry = require('../models/Inquiry');

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, property } = req.body;
    const inquiry = await Inquiry.create({
      name, email, phone, message, property,
      user: req.user?._id,
    });
    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate('property', 'title location price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };
