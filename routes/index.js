// routes/index.js
const express = require("express");
const authRoutes = require("./auth"); // Ganti dengan require
const ipfsRoutes = require("./ipfsRoutes"); // Ganti dengan require
const plantRoutes = require("./plant"); // Ganti dengan require

const router = express.Router();

router.use("/auth", authRoutes); // Gabungkan authRoutes ke router utama dengan awalan /auth
router.use("/plants", plantRoutes); // Gabungkan plantRoutes ke router utama dengan awalan /plants
router.use("/ipfs", ipfsRoutes); // Gabungkan ipfsRoutes ke router utama dengan awalan /ipfs

// Error handling untuk rute yang tidak ditemukan
router.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Menggunakan module.exports agar sesuai dengan CommonJS
module.exports = router; // Ganti dengan module.exports
