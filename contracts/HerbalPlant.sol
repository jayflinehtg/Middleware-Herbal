// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HerbalPlant {
    // Struktur data untuk tanaman
    struct Plant {
        string name;                // Nama Tanaman
        string namaLatin;            // Nama Latin Tanaman
        string komposisi;            // Komposisi/Kandungan Tanaman
        string kegunaan;             // Manfaat Tanaman
        string caraPengolahan;        // Cara Pengolahan Tanaman
        string ipfsHash;            // Menyimpan CID dari IPFS
        uint ratingTotal;
        uint ratingCount;
        uint likeCount;             // Menghitung jumlah like
        mapping(address => uint) ratings; // Menyimpan rating bintang per pengguna
        mapping(address => bool) liked;   // Menghindari like ganda
        address owner;
    }

    // Struktur data untuk pengguna
    struct User {
        string fullName;
        string email;
        address publicKey;
        bytes32 passwordHash;
        bytes32 salt;
        bool isRegistered;
        bool isLoggedIn;
    }

    // Mappings untuk menyimpan data tanaman dan pengguna
    mapping(uint => Plant) public plants;
    mapping(string => User) private usersByEmail; // Simpan user berdasarkan email
    mapping(string => bool) public emailExists;
    uint public plantCount;

    // Events untuk logging aktivitas
    event PlantAdded(uint plantId, string name, string namaLatin, string komposisi, string kegunaan, string caraPengolahan, string ipfsHash, address owner);
    event PlantRated(uint plantId, address user, uint rating);
    event UserRegistered(address user, string fullName);
    event UserLoggedIn(address user);
    event UserLoggedOut(address user);
    event PlantLiked(uint plantId, address user);

    // Modifiers untuk membatasi akses fungsi
    modifier onlyRegisteredUser(string memory email) {
        require(usersByEmail[email].isRegistered, "Anda harus terdaftar untuk melakukan ini");
        require(usersByEmail[email].isLoggedIn, "Anda harus login untuk melakukan ini");
        _;
    }

    modifier onlyOwner(uint plantId) {
        require(msg.sender == plants[plantId].owner, "Anda bukan pemilik tanaman ini");
        _;
    }

    // Fungsi untuk menghasilkan salt secara acak
    function generateSalt() private view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, msg.sender));
    }

    // Fungsi-fungsi untuk manajemen pengguna
    function registerUser(string memory fullName, string memory email, string memory password) public {
        require(!emailExists[email], "Email sudah terdaftar");

        bytes32 salt = generateSalt();
        bytes32 hashedPassword = keccak256(abi.encodePacked(password, salt));

        usersByEmail[email] = User({
            fullName: fullName,
            email: email,
            publicKey: msg.sender,
            passwordHash: hashedPassword,
            salt: salt,
            isRegistered: true,
            isLoggedIn: false
        });

        emailExists[email] = true;
        emit UserRegistered(msg.sender, fullName);
    }

    function loginWithEmail(string memory email, string memory password) public {
        require(usersByEmail[email].isRegistered, "Pengguna belum terdaftar");
        require(usersByEmail[email].publicKey == msg.sender, "Alamat tidak cocok dengan email");
        bytes32 salt = usersByEmail[email].salt;
        bytes32 hashedPassword = keccak256(abi.encodePacked(password, salt));

        require(usersByEmail[email].passwordHash == hashedPassword, "Password salah");
        require(!usersByEmail[email].isLoggedIn, "Anda sudah login");
        
        usersByEmail[email].isLoggedIn = true;
        emit UserLoggedIn(msg.sender);
    }

    function logout(string memory email) public {
        require(usersByEmail[email].isLoggedIn, "Anda belum login");
        usersByEmail[email].isLoggedIn = false;
        emit UserLoggedOut(msg.sender);
    }

    // Fungsi-fungsi untuk manajemen tanaman
    function addPlant(string memory email, string memory name, string memory namaLatin, string memory komposisi, string memory kegunaan, string memory caraPengolahan, string memory ipfsHash) public onlyRegisteredUser(email) {
        uint plantId = plantCount;
        Plant storage plant = plants[plantId];
        plant.name = name;
        plant.namaLatin = namaLatin;
        plant.komposisi = komposisi;
        plant.kegunaan = kegunaan;
        plant.caraPengolahan = caraPengolahan;
        plant.ipfsHash = ipfsHash;
        plant.ratingTotal = 0;
        plant.ratingCount = 0;
        plant.likeCount = 0;
        plant.owner = msg.sender;

        plantCount++;
        emit PlantAdded(plantId, name, namaLatin, komposisi, kegunaan, caraPengolahan, ipfsHash, msg.sender);
    }

    function ratePlant(string memory email, uint plantId, uint rating) public onlyRegisteredUser(email) {
        require(rating >= 1 && rating <= 5, "Rating harus antara 1 dan 5");
        require(bytes(plants[plantId].name).length > 0, "Tanaman tidak ditemukan");

        Plant storage plant = plants[plantId];

        if (plant.ratings[msg.sender] > 0) {
            plant.ratingTotal = plant.ratingTotal - plant.ratings[msg.sender] + rating;
        } else {
            plant.ratingTotal += rating;
            plant.ratingCount++;
        }

        plant.ratings[msg.sender] = rating;
        emit PlantRated(plantId, msg.sender, rating);
    }

    function likePlant(string memory email, uint plantId) public onlyRegisteredUser(email) {
        Plant storage plant = plants[plantId];

        if (plant.liked[msg.sender]) {
            plant.liked[msg.sender] = false;
            plant.likeCount--;
        } else {
            plant.liked[msg.sender] = true;
            plant.likeCount++;
        }
        emit PlantLiked(plantId, msg.sender);
    }

    // Fungsi-fungsi untuk mendapatkan informasi tanaman
    function getPlantRating(uint plantId) public view returns (uint averageRating) {
        require(bytes(plants[plantId].name).length > 0, "Tanaman tidak ditemukan");
        Plant storage plant = plants[plantId];
        return plant.ratingCount == 0 ? 0 : plant.ratingTotal / plant.ratingCount;
    }

    function getPlantBasicInfo(uint plantId) public view returns (
        string memory name,
        string memory namaLatin,
        string memory komposisi,
        string memory kegunaan,
        string memory caraPengolahan,
        string memory ipfsHash
    ) {
        require(bytes(plants[plantId].name).length > 0, "Tanaman tidak ditemukan");
        Plant storage plant = plants[plantId];
        return (
            plant.name,
            plant.namaLatin,
            plant.komposisi,
            plant.kegunaan,
            plant.caraPengolahan,
            plant.ipfsHash
        );
    }

    function getPlantMetrics(uint plantId) public view returns (
        uint averageRating,
        uint ratingCount,
        uint likeCount,
        address owner
    ) {
        require(bytes(plants[plantId].name).length > 0, "Tanaman tidak ditemukan");
        Plant storage plant = plants[plantId];
        return (
            getPlantRating(plantId),
            plant.ratingCount,
            plant.likeCount,
            plant.owner
        );
    }

    // Getter function for user data
    function getUserByEmail(string memory email) public view returns (User memory) {
        return usersByEmail[email];
    }
}