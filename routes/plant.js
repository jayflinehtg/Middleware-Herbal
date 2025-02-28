const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  addPlantData,
  ratePlant,
  likePlant,
  submitTestimonial,
} = require("../controllers/plantController"); // Make sure to require controllers correctly
const router = express.Router();

// Route for adding plant data
router.post(
  "/addPlantData",
  [
    body("plantName").notEmpty().withMessage("Nama tanaman harus diisi"),
    body("description").notEmpty().withMessage("Deskripsi harus diisi"),
    body("ipfsHash").notEmpty().withMessage("Hash IPFS harus diisi"),
  ],
  async (req, res) => {
    console.log("Route POST /addPlantData dipanggil di plant.js");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { plantName, description, ipfsHash } = req.body;
      const txHash = await addPlantData(req, res);
      res.json({
        success: true,
        message: "Tanaman berhasil ditambahkan!",
        txHash: txHash,
      });
    } catch (error) {
      console.error("Error in /addPlantData:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add plant data",
        error: error.message,
      });
    }
  }
);

// Route for rating a plant
router.post(
  "/ratePlant",
  [
    body("plantId").isInt().withMessage("Plant ID harus berupa angka"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating harus antara 1 dan 5"),
  ],
  async (req, res) => {
    console.log("Route POST /ratePlant dipanggil di plant.js");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { plantId, rating } = req.body;
      const txHash = await ratePlant(req, res);
      res.json({
        success: true,
        message: "Rating berhasil diberikan",
        txHash: txHash,
      });
    } catch (error) {
      console.error("Error in /ratePlant:", error);
      res.status(500).json({
        success: false,
        message: "Failed to rate plant",
        error: error.message,
      });
    }
  }
);

// Route for liking a plant
router.post(
  "/likePlant",
  [body("plantId").isInt().withMessage("Plant ID harus berupa angka")],
  async (req, res) => {
    console.log("Route POST /likePlant dipanggil di plant.js");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { plantId } = req.body;
      const txHash = await likePlant(req, res);
      res.json({
        success: true,
        message: "Like berhasil diberikan",
        txHash: txHash,
      });
    } catch (error) {
      console.error("Error in /likePlant:", error);
      res.status(500).json({
        success: false,
        message: "Failed to like plant",
        error: error.message,
      });
    }
  }
);

// Route for submitting a testimonial for a plant
router.post(
  "/submitTestimonial",
  [
    body("plantId").isInt().withMessage("Plant ID harus berupa angka"),
    body("testimonial").notEmpty().withMessage("Testimonial harus diisi"),
  ],
  async (req, res) => {
    console.log("Route POST /submitTestimonial dipanggil di plant.js");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { plantId, testimonial } = req.body;
      const txHash = await submitTestimonial(req, res);
      res.json({
        success: true,
        message: "Testimonial berhasil diberikan",
        txHash: txHash,
      });
    } catch (error) {
      console.error("Error in /submitTestimonial:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit testimonial",
        error: error.message,
      });
    }
  }
);

module.exports = router;
