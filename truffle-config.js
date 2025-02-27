// truffle-config.js
require("dotenv").config(); // Pastikan require dotenv berada di sini
const path = require("path"); // Ganti dengan require untuk path

const config = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      // from: "0x9348c2dd91057df7d0f49da496e0373fd4eda40e5c6c1fa07423d9c6152a18fb", // Private key langsung (HANYA UNTUK TESTING)
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
  contracts_directory: path.join(__dirname, "contracts"),
  contracts_build_directory: path.join(__dirname, "build", "contracts"),
  mocha: {
    // timeout: 100000
  },
};

// Menggunakan module.exports untuk mengekspor konfigurasi
module.exports = config; // Ganti dengan module.exports
