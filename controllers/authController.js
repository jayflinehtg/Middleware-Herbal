// const bcrypt = require('bcrypt');
// const { saveUserToBlockchain, getPasswordFromBlockchain } = require('../utils/blockchain');  // Fungsi untuk berinteraksi dengan blockchain

// const saltRounds = 12;  // Tentukan jumlah salt rounds untuk bcrypt

// // Fungsi untuk hash password
// async function hashPassword(password) {
//     return await bcrypt.hash(password, saltRounds);  // Mengembalikan hash dari password yang diinputkan
// }

// // Fungsi untuk verifikasi password
// async function verifyPassword(inputPassword, storedHash) {
//     return await bcrypt.compare(inputPassword, storedHash);  // Memverifikasi apakah password input cocok dengan hash yang tersimpan
// }

// // Fungsi untuk registrasi user
// async function registerUser(name, email, publicKey, password) {
//     try {
//         // Hash password sebelum disimpan ke blockchain
//         const hashedPassword = await hashPassword(password);

//         // Simpan user ke blockchain dengan hashed password
//         const txHash = await saveUserToBlockchain(name, email, publicKey, hashedPassword);
//         return txHash;  // Kembalikan transaksi hash untuk pelacakan
//     } catch (error) {
//         throw new Error(`Error registering user: ${error.message}`);
//     }
// }

// // Fungsi untuk login user
// async function loginUser(publicKey, password) {
//     try {
//         // Ambil hash password yang ada di blockchain berdasarkan publicKey
//         const storedHash = await getPasswordFromBlockchain(publicKey);

//         // Verifikasi password input dengan hash yang ada di blockchain
//         const isPasswordValid = await verifyPassword(password, storedHash);

//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         return true;  // Jika password valid
//     } catch (error) {
//         throw new Error(`Error logging in: ${error.message}`);
//     }
// }

// module.exports = { hashPassword, verifyPassword, registerUser, loginUser };

const bcrypt = require("bcryptjs"); // Ganti dengan require
const {
  saveUserToBlockchain,
  getPasswordFromBlockchain,
} = require("../utils/blockchain.js"); // Ganti dengan require

const saltRounds = 12;

// Fungsi untuk hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

// Fungsi untuk verifikasi password
async function verifyPassword(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash);
}

// Fungsi untuk registrasi user
async function registerUser(name, email, publicKey, password) {
  console.log("fungsi registerUser dipanggil di authController.js"); // Debugging
  try {
    const hashedPassword = await hashPassword(password);
    const txHash = await saveUserToBlockchain(
      name,
      email,
      publicKey,
      hashedPassword
    );
    return txHash;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw new Error(
      `Error registering user: ${error.message} (Details: ${error})`
    );
  }
}

// Fungsi untuk login user
async function loginUser(publicKey, password) {
  console.log("fungsi loginUser dipanggil di authController.js"); // Debugging
  try {
    const storedHash = await getPasswordFromBlockchain(publicKey);
    const isPasswordValid = await verifyPassword(password, storedHash);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return true;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error(`Error logging in: ${error.message} (Details: ${error})`);
  }
}

// Middleware untuk hanya menerima user yang terdaftar
function onlyRegisteredUser(req, res, next) {
  // Pengecekan apakah user sudah terdaftar, misalnya cek session atau token di sini
  console.log("Verifying registered user..."); // Debugging
  next();
}

// Menggunakan module.exports agar sesuai dengan CommonJS
module.exports = {
  hashPassword,
  verifyPassword,
  registerUser,
  loginUser,
  onlyRegisteredUser,
};
