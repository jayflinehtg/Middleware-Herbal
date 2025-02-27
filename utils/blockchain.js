require("dotenv").config();
const { ethers } = require("ethers"); // Gunakan ethers.js

const ganacheUrl = process.env.GANACHE_URL || "http://localhost:7545";

// Membuat koneksi dengan provider
let provider;
try {
  provider = new ethers.JsonRpcProvider(ganacheUrl); // Koneksi dengan Ganache
  console.log(`Terhubung ke Ganache di ${ganacheUrl}`);
} catch (error) {
  console.error("Gagal terhubung ke Ganache:", error);
  process.exit(1);
}

if (!process.env.SMART_CONTRACT_ADDRESS) {
  console.error(
    "SMART_CONTRACT_ADDRESS tidak ditemukan di environment variables."
  );
  process.exit(1);
}

let contractABI;
try {
  contractABI = require("../build/contracts/HerbalPlant.json").abi; // Mengambil ABI kontrak
} catch (error) {
  console.error("Gagal mengimpor ABI:", error);
  process.exit(1);
}

const contractAddress = process.env.SMART_CONTRACT_ADDRESS;

// Membuat instance kontrak menggunakan Ethers.js
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Menggunakan wallet dari private key untuk menandatangani transaksi
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Fungsi untuk menyimpan user ke blockchain
async function saveUserToBlockchain(name, email, publicKey, hashedPassword) {
  try {
    const tx = await contract.registerUser(
      name,
      email,
      publicKey,
      hashedPassword,
      {
        gasLimit: 5000000, // Tentukan gas limit jika diperlukan
        gasPrice: await provider.getGasPrice(),
        from: wallet.address,
      }
    );
    await tx.wait();
    console.log("Transaksi berhasil:", tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.error("Gagal menyimpan user ke blockchain:", error);
    throw new Error(`Gagal menyimpan user ke blockchain: ${error.message}`);
  }
}

// Fungsi untuk mendapatkan password dari blockchain
async function getPasswordFromBlockchain(publicKey) {
  try {
    const passwordHash = await contract.getUserPassword(publicKey);
    return passwordHash;
  } catch (error) {
    console.error("Gagal mengambil password dari blockchain:", error);
    throw new Error(
      `Gagal mengambil password dari blockchain: ${error.message}`
    );
  }
}

// Ekspor fungsi yang akan digunakan di tempat lain
module.exports = { saveUserToBlockchain, getPasswordFromBlockchain };
