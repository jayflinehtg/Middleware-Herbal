// server.js
const express = require("express"); // Menggunakan require untuk express
const { startIPFS } = require("./ipfs"); // Menggunakan require dan tanpa .js
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/index"); // Menggunakan require dan tanpa .js

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menggunakan rute dari routes/index.js
app.use("/api", routes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log full stack trace
  res.status(500).json({
    message: "Terjadi kesalahan server!",
    error: err.message,
  });
});

// Fungsi async untuk memulai IPFS dan kemudian menjalankan server
async function startServer() {
  try {
    await startIPFS();
    console.log("IPFS Node started successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start IPFS:", err);
    process.exit(1); // Exit the application if IPFS fails to start
  }
}

// Memulai server
startServer();
