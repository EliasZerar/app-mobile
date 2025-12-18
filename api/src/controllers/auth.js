const bcrypt = require('bcryptjs');
const User = require('../models/user');
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

router.post('/register',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword });
            await user.save();

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token: token,
                user: { id: user._id, email: user.email }
            });
        } catch (err) {
            res.status(500).json({ message: 'Error registering user', error: err.message });
        }
    }
);

module.exports = router;