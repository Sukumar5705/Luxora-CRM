const express = require('express');
const router  = express.Router();
const { createInquiry, getInquiries, updateInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect }   = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/',      createInquiry);
router.get('/',       protect, adminOnly, getInquiries);
router.put('/:id',    protect, adminOnly, updateInquiry);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
