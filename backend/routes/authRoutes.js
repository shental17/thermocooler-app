const express = require("express");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('./models/User'); 

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to database
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;
