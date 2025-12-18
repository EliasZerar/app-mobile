const bcrypt = require('bcryptjs');
const User = require('../models/user');
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Code de réinitialisation',
            text: `Votre code de validation est : ${otp}\nCe code expire dans 1 heure.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent' });

    } catch (err) {
        res.status(500).json({ message: 'Error in forgot password', error: err.message });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string' || token.trim().length !== 6) {
        return res.status(400).json({ message: 'Format de code invalide' });
    }

    try {
        const user = await User.findOne({
            resetPasswordOtp: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Code incorrect ou expiré' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been updated' });

    } catch (err) {
        console.error("Erreur interne reset-password:", err);
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
});

module.exports = router;