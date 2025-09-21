const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validation');

router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Valid email required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

module.exports = router;