// controllers/auth.js
const express = require('express');  // Ganti dengan require
const { body, validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');  // Ganti dengan require

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('publicKey').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum public key format'),
    body('name').notEmpty().withMessage('Name is required') // Contoh validasi tambahan
], async (req, res) => {
    console.log("Route POST /register dipanggil di auth.js"); // Debugging
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name, email, publicKey, password } = req.body;
        const txHash = await registerUser(name, email, publicKey, password);
        res.json({ success: true, message: "User registered successfully!", txHash });
    } catch (error) {
        console.error("Error in /register:", error); // Log error
        res.status(500).json({ 
            success: false, 
            message: "Registration failed", 
            error: error.message 
        });
    }
});

router.post('/login', [
    body('publicKey').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum public key format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    console.log("Route POST /login dipanggil di auth.js"); // Debugging
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { publicKey, password } = req.body;
        const isValid = await loginUser(publicKey, password);

        if (isValid) {
            res.json({ success: true, message: "Login berhasil!" });
        } else {
            res.status(401).json({ success: false, message: "Kredensial Tidak Valid" });
        }
    } catch (error) {
        console.error("Error in /login:", error); // Log error
        res.status(500).json({ 
            success: false, 
            message: "Login gagal", 
            error: error.message 
        });
    }
});

// Menggunakan module.exports agar sesuai dengan CommonJS
module.exports = router; 
