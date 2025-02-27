// ipfs.js
const { create } = require("ipfs-http-client"); // Ganti dengan require

let ipfsNode = null;

async function startIPFS() {
  try {
    if (ipfsNode) {
      console.log("IPFS Node sudah berjalan!");
      return; // Jika IPFS sudah berjalan, tidak perlu memulai lagi
    }
    ipfsNode = create();
    console.log("IPFS Node is running!");
  } catch (error) {
    console.error("Gagal memulai IPFS:", error);
    throw error; // Re-throw the error for handling in server.js
  }
}

async function stopIPFS() {
  try {
    if (!ipfsNode) {
      console.log("IPFS Node tidak aktif.");
      return; // Tidak ada node untuk dihentikan
    }
    await ipfsNode.stop();
    console.log("IPFS Node stopped!");
    ipfsNode = null;
  } catch (error) {
    console.error("Gagal menghentikan IPFS:", error);
    throw error; // Re-throw the error for handling elsewhere
  }
}

async function addFileToIPFS(fileBuffer) {
  if (!ipfsNode) {
    throw new Error(
      "IPFS node belum dijalankan. Panggil startIPFS() terlebih dahulu."
    );
  }

  try {
    const { cid } = await ipfsNode.add(fileBuffer);
    console.log(`File added with CID: ${cid.toString()}`);
    return cid.toString();
  } catch (error) {
    console.error("Gagal menambahkan file ke IPFS:", error);
    throw error; // Re-throw the error
  }
}

async function getFileFromIPFS(cid) {
  if (!ipfsNode) {
    throw new Error(
      "IPFS node belum dijalankan. Panggil startIPFS() terlebih dahulu."
    );
  }

  try {
    const stream = ipfsNode.cat(cid);
    let fileData = "";

    for await (const chunk of stream) {
      fileData += chunk.toString();
    }

    console.log("File retrieved from IPFS");
    return fileData;
  } catch (error) {
    console.error("Gagal mengambil file dari IPFS:", error);
    throw error; // Re-throw the error
  }
}

module.exports = { startIPFS, stopIPFS, addFileToIPFS, getFileFromIPFS };
