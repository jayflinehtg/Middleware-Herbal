const bcrypt = require("bcryptjs"); // Menggunakan bcrypt untuk hashing password
const {
  saveUserToBlockchain,
  getPasswordFromBlockchain,
} = require("../utils/blockchain.js"); // Menggunakan require untuk berinteraksi dengan blockchain

const saltRounds = 12;

// Fungsi untuk hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds); // Menggunakan bcrypt untuk hashing password
}

// Fungsi untuk verifikasi password
async function verifyPassword(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash); // Verifikasi password dengan bcrypt
}

// Fungsi untuk registrasi user
async function registerUser(name, email, publicKey, password) {
  console.log("fungsi registerUser dipanggil di authController.js"); // Debugging
  try {
    // Mengecek apakah publicKey sudah terdaftar
    const existingUser = await getPasswordFromBlockchain(publicKey);
    if (existingUser) {
      throw new Error("Public Key sudah terdaftar");
    }

    const hashedPassword = await hashPassword(password); // Hash password terlebih dahulu
    const txHash = await saveUserToBlockchain(
      name,
      email,
      publicKey,
      hashedPassword // Kirim hashed password ke blockchain
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
    // Ambil password yang sudah di-hash dari blockchain
    const storedHash = await getPasswordFromBlockchain(publicKey);
    if (!storedHash) {
      throw new Error("User belum terdaftar");
    }

    // Verifikasi password dengan bcrypt
    const isPasswordValid = await verifyPassword(password, storedHash);

    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    return true; // Jika password valid
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
