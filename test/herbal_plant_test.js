const HerbalPlant = artifacts.require("HerbalPlant");

contract("HerbalPlant", (accounts) => {
  let herbalPlant;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const email1 = "test1@example.com";
  const email2 = "test2@example.com";

  before(async () => {
    herbalPlant = await HerbalPlant.deployed();
  });

  describe("User Management", () => {
    it("should register a user", async () => {
      await herbalPlant.registerUser("Test User 1", email1, "password", {
        from: user1,
      });
      const user = await herbalPlant.getUserByEmail(email1);
      assert.equal(user.fullName, "Test User 1");
      assert.equal(user.email, email1);
      assert.equal(user.isRegistered, true);
    });

    it("should login a user", async () => {
      await herbalPlant.loginWithEmail(email1, "password", { from: user1 });
      const user = await herbalPlant.getUserByEmail(email1);
      assert.equal(user.isLoggedIn, true);
    });

    it("should logout a user", async () => {
      await herbalPlant.logout(email1, { from: user1 });
      const user = await herbalPlant.getUserByEmail(email1);
      assert.equal(user.isLoggedIn, false);
    });
  });

  describe("Plant Management", () => {
    let plantId;

    before(async () => {
      await herbalPlant.registerUser("Test User 2", email2, "password", {
        from: user2,
      });
      await herbalPlant.loginWithEmail(email2, "password", { from: user2 });
    });

    it("should add a plant", async () => {
      await herbalPlant.addPlant(
        email2,
        "Plant 1",
        "Latin Plant 1",
        "Composition 1",
        "Uses 1",
        "Preparation 1",
        "ipfsHash1",
        { from: user2 }
      );
      plantId = (await herbalPlant.plantCount()) - 1;
      const plant = await herbalPlant.plants(plantId);
      assert.equal(plant.name, "Plant 1");
      assert.equal(plant.owner, user2);
    });

    it("should rate a plant", async () => {
      await herbalPlant.loginWithEmail(email1, "password", { from: user1 }); // Login user1
      await herbalPlant.ratePlant(email1, plantId, 4, { from: user1 });
      const plant = await herbalPlant.plants(plantId);
      assert.equal(plant.ratingTotal, 4);
      assert.equal(plant.ratingCount, 1);
    });

    it("should like a plant", async () => {
      await herbalPlant.loginWithEmail(email1, "password", { from: user1 }); // Login user1
      await herbalPlant.likePlant(email1, plantId, { from: user1 });
      const plant = await herbalPlant.plants(plantId);
      assert.equal(plant.likeCount, 1);

      await herbalPlant.likePlant(email1, plantId, { from: user1 }); // Unlike
      assert.equal(plant.likeCount, 0);
    });

    it("should get plant rating", async () => {
      await herbalPlant.loginWithEmail(email1, "password", { from: user1 }); // Login user1
      await herbalPlant.ratePlant(email1, plantId, 4, { from: user1 }); // Rate the plant
      const averageRating = await herbalPlant.getPlantRating(plantId);
      assert.equal(averageRating, 4);
    });

    it("should get plant basic info", async () => {
      const [name, namaLatin, komposisi, kegunaan, caraPengolahan, ipfsHash] =
        await herbalPlant.getPlantBasicInfo(plantId); // Destructuring assignment
      assert.equal(name, "Plant 1");
      assert.equal(namaLatin, "Latin Plant 1");
      assert.equal(komposisi, "Composition 1");
      assert.equal(kegunaan, "Uses 1");
      assert.equal(caraPengolahan, "Preparation 1");
      assert.equal(ipfsHash, "ipfsHash1");
    });

    it("should get plant metrics", async () => {
      const [averageRating, ratingCount, likeCount, owner] =
        await herbalPlant.getPlantMetrics(plantId); // Destructuring assignment
      assert.equal(averageRating, 4);
      assert.equal(ratingCount, 1);
      assert.equal(likeCount, 0);
      assert.equal(owner, user2);
    });
  });
});
