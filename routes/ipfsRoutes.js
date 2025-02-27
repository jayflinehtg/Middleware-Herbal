// routes/ipfsRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { addFileToIPFS, getFileFromIPFS } = require("../ipfs"); // Ganti dengan require
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const cid = await addFileToIPFS(fileBuffer);
    res.status(200).json({ message: "File uploaded to IPFS", cid: cid });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Upload error:", err); // Log error yang lebih detail (termasuk stack trace)
    res
      .status(500)
      .json({ message: "Failed to upload file", error: err.message }); // Kirim pesan error yang lebih informatif
  }
});

router.get("/file/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const fileData = await getFileFromIPFS(cid);
    res.status(200).send(fileData);
  } catch (err) {
    console.error("Retrieve error:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve file", error: err.message });
  }
});

// Menggunakan module.exports untuk ekspor router
module.exports = router; // Ganti dengan module.exports
