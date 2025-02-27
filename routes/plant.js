const express = require("express");
const { body } = require("express-validator");
const plantController = require("../controllers/plantController"); // Pastikan sudah mengimpor dengan benar
const { onlyRegisteredUser } = require("../controllers/authController"); // Pastikan ini ada dan diimpor dengan benar

const router = express.Router();

// Menambahkan rute
router.post(
  "/addPlantData",
  [
    body("plantName").notEmpty().withMessage("Nama tanaman harus diisi"),
    body("description").notEmpty().withMessage("Deskripsi harus diisi"),
    body("ipfsHash").notEmpty().withMessage("Hash IPFS harus diisi"),
  ],
  onlyRegisteredUser, // Menambahkan middleware yang memeriksa apakah user terdaftar
  (req, res, next) => {
    console.log("Route POST /addPlantData dipanggil di plant.js");
    plantController.addPlantData(req, res, next); // Memanggil controller yang sesuai
  }
);

router.get("/getPlantData/:id", (req, res, next) => {
  console.log("Route GET /getPlantData/:id dipanggil di plant.js");
  plantController.getPlantData(req, res, next); // Menambahkan data tanaman berdasarkan ID
});

router.post("/ratePlant", onlyRegisteredUser, (req, res, next) => {
  console.log("Route POST /ratePlant dipanggil di plant.js");
  plantController.ratePlant(req, res, next); // Memberikan rating pada tanaman
});

router.post("/likePlant", onlyRegisteredUser, (req, res, next) => {
  console.log("Route POST /likePlant dipanggil di plant.js");
  plantController.likePlant(req, res, next); // Memberikan like pada tanaman
});

router.post("/submitTestimonial", onlyRegisteredUser, (req, res, next) => {
  console.log("Route POST /submitTestimonial dipanggil di plant.js");
  plantController.submitTestimonial(req, res, next); // Menambahkan testimoni pada tanaman
});

module.exports = router;
