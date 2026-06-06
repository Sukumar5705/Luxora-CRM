const express = require('express');
const router  = express.Router();
const {
  getProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, getStats,
} = require('../controllers/propertyController');
const { protect }   = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/stats', protect, adminOnly, getStats);
router.get('/',      getProperties);
router.get('/:id',   getPropertyById);
router.post('/',     protect, adminOnly, createProperty);
router.put('/:id',   protect, adminOnly, updateProperty);
router.delete('/:id',protect, adminOnly, deleteProperty);

module.exports = router;
