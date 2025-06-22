const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Get all users
router.get('/users', authController.getAllUsers);

// Get all vendors
router.get('/vendors', authController.getAllVendors);

// Get vendor by ID
router.get('/vendors/:id', authController.getVendorById);

module.exports = router;