const { ethers } = require("ethers"); // Gunakan ethers.js
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config(); // Memuat variabel lingkungan dari file .env

// Menentukan path ke file ABI
const contractPath = path.resolve(
  __dirname,
  "../build/contracts/HerbalPlant.json"
);
console.log("Contract path:", contractPath);

// Memeriksa apakah file ABI ada di lokasi yang benar
if (!fs.existsSync(contractPath)) {
  console.error("File contract ABI tidak ditemukan di:", contractPath);
  process.exit(1); // Keluar jika file tidak ditemukan
}

// Memuat ABI contract
const contractABI = require(contractPath).abi;

// Konfigurasi provider dan smart contract
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.SMART_CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// Fungsi untuk menambahkan data tanaman ke blockchain
async function addPlantData(req, res) {
  try {
    const { plantName, description, ipfsHash } = req.body;
    const tx = await contract.addPlant(plantName, description, ipfsHash);
    await tx.wait(); // Tunggu transaksi selesai
    res.json({
      success: true,
      message: "Data berhasil ditambahkan ke blockchain",
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Error in addPlantData:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan data tanaman",
      error: error.message,
    });
  }
}

// Fungsi untuk mengambil data tanaman berdasarkan ID
async function getPlantData(req, res) {
  try {
    const { id } = req.params;
    if (!id || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }
    const plantData = await contract.getPlantById(id);
    res.json({ success: true, data: plantData });
  } catch (error) {
    console.error("Error in getPlantData:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data tanaman",
      error: error.message,
    });
  }
}

// Fungsi untuk memberikan rating pada tanaman
async function ratePlant(req, res) {
  try {
    const { id, rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating harus antara 1 dan 5" });
    }
    const tx = await contract.ratePlant(id, rating);
    await tx.wait();
    res.json({
      success: true,
      message: "Rating berhasil diberikan",
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Error in ratePlant:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memberi rating",
      error: error.message,
    });
  }
}

// Fungsi untuk memberikan like pada tanaman
async function likePlant(req, res) {
  try {
    const { id } = req.body;
    const tx = await contract.likePlant(id);
    await tx.wait();
    res.json({
      success: true,
      message: "Like berhasil diberikan",
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Error in likePlant:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memberi like",
      error: error.message,
    });
  }
}

// Fungsi untuk menambahkan testimoni pada tanaman
async function submitTestimonial(req, res) {
  try {
    const { id, testimonial } = req.body;
    const tx = await contract.submitTestimonial(id, testimonial);
    await tx.wait();
    res.json({
      success: true,
      message: "Testimoni berhasil diberikan",
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Error in submitTestimonial:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memberikan testimoni",
      error: error.message,
    });
  }
}

// Ekspor fungsi-fungsi untuk digunakan di rute
module.exports = {
  addPlantData,
  getPlantData,
  ratePlant,
  likePlant,
  submitTestimonial,
};
