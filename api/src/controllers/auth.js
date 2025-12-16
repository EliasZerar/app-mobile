const bcrypt = require('bcryptjs');
const User = require('../models/user');
const express = require("express");
const jwt = require('jsonwebtoken'); // Import this
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Ideally, put this in a .env file
const JWT_SECRET = "YOUR_SUPER_SECRET_KEY";

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // --- NEW: Generate the Token ---
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' } // Token valid for 7 days
        );

        // Send the token AND the user data back
        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// --- NEW: Logout Endpoint ---
router.post('/logout', (req, res) => {
    // With JWT, the server is "stateless". It doesn't remember who is logged in.
    // Therefore, to "logout", the server just says "OK".
    // The REAL logout happens on the Frontend (deleting the token).
    res.status(200).json({ message: 'Logged out successfully' });
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

            // Optional: You can also generate a token here so they are logged in immediately after registering
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error registering user', error: err.message });
        }
    }
);

module.exports = router;