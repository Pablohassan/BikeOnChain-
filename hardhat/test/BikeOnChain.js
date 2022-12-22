const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const BikeCollection = require("../artifacts/contracts/BikeCollection.sol/BikeCollection.json")

async function caller(contract, address) {
  return contract.connect(await ethers.getSigner(address))
}

describe("Bike On Chain contracts", function () {

  async function deployFixture() {
    const BikeCollectionFactory = await ethers.getContractFactory("BikeCollectionFactory");
    const [owner, manufacturer, user, user2] = await ethers.getSigners();
    const factory = await BikeCollectionFactory.deploy();
    await factory.deployed();

    
    return { factory, owner, manufacturer, user, user2 };
  }

  async function deployAndCreateCollections() {
    const res = await loadFixture(deployFixture);
    const { factory, manufacturer } = res;

    await expect(factory.createCollection("Decathlon By BoC", "BOC", manufacturer.address))
      .to.emit(factory, "CollectionCreated")
      .withArgs(anyValue, manufacturer.address, "Decathlon By BoC", "BOC");

    expect(await factory.connect(manufacturer.address).isCollectionOwner()).to.equal(true);

   

    const collectionAddr = await factory.connect(manufacturer.address).getCollection();
    const BikeCollection = await ethers.getContractFactory("BikeCollection");
    const collection = await caller(BikeCollection.attach(collectionAddr), manufacturer.address);

    return { ...res, collection };
  }

  async function deployAndCreateCollectionsAndMint() {
    const res = await deployAndCreateCollections();
    const { collection } = res;

    await expect(collection.batchMint(2, "Rockrider Bike", "Good bike","Mybike","white","city", "http//example.com/bike.jpg", 2022))
      .to.emit(collection, "GroupCreated")
      .withArgs(anyValue, 2, anyValue);

    expect(await collection.getGroupsAmount()).to.be.eq(1);

    expect(await collection.getGroupAmount(1)).to.be.eq(2);

    return res;
  }

  ////////////////////////////////////////////////////////////////
  // BikeCollectionFactory
  ////////////////////////////////////////////////////////////////

  describe("BikeCollectionFactory", () => {
    it("Create collection success", deployAndCreateCollections);

    it("Create collection failed", async () => {
      const { factory, manufacturer } = await deployAndCreateCollections();

      await expect(factory.createCollection("Go Sport By BoC", "BOC", manufacturer.address))
        .to.be.revertedWith("Already has a collection");
    });
    
  });

  ////////////////////////////////////////////////////////////////
  // BikeCollection
  ////////////////////////////////////////////////////////////////

  describe("BikeCollection",  () => {
    
    describe("Mint", () => {
      it("Batch mint success", deployAndCreateCollectionsAndMint);

      it("Batch mint failed", async () => {
        const res = await deployAndCreateCollections();
        const { collection, owner } = res;

        const collectionWithCaller = await caller(collection, owner.address);

        await expect(collectionWithCaller.batchMint(2, "Rockrider Bike", "Good bike","Mybike","white","city", "http//example.com/bike.jpg", 2022))
          .to.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe("BikeCollectionSatus", () => {
      

      async function bikeStat(){
      const res = await deployAndCreateCollectionsAndMint()
        const { collection, owner } = res;
        await collection.setInService(1);
        const bike = await collection._bikeByTokenId(bike)

        return { bike };

      }
    
      it("should update the status of a bike", async () => {
   
        const res = await bikeStat();
        const {bike} = res

        // Set the status of the bike to "InService"
       
      
        // Get the bike struct
       
       
    
        // Check that the status of the bike is "InService"
        expect(bike.status).to.equal(Inservice);
      });
    
      it("should revert if the new status is invalid", async () => {
        const res = await bikeStat();
        const {bike} = res
       
        // Attempt to set the status of the bike to an invalid value
        try {
          await collection == bike.status.OnSale;
          expect.fail();
        } catch (error) {
          expect(error.message).to.include("Not allowed");
        }
      });
    });

    describe("Transfer", () => {
      it("Batch transfer for sale success", async () => {
        const { collection, manufacturer, user } = await deployAndCreateCollectionsAndMint();
        
        await expect(collection.batchTransferForSale(manufacturer.address, user.address, 1, 2))
          .to.emit(collection, "GroupUpdated")
          .withArgs(1, 0);
      });

      it("Batch transfer for sale failed", async () => {
        const { collection, manufacturer, user } = await deployAndCreateCollectionsAndMint();
        
        await expect(collection.batchTransferForSale(manufacturer.address, user.address, 1, 3))
          .to.revertedWith("Amount too higher")
      });

      it("Batch transfer for service success", async () => {
        const { collection, manufacturer, user, user2 } = await deployAndCreateCollectionsAndMint();
        
        await collection.batchTransferForSale(manufacturer.address, user.address, 1, 2);
        const collectionWithCaller = await caller(collection, user.address);

        await expect(collectionWithCaller.transferForService(user.address, user2.address, 1, "SN772626", 2022))
          .to.emit(collection, "Transfer")
          .withArgs(user.address, user2.address, 1);
      });

      it("Change Status in service", async () => {

        const { collection, manufacturer, user, user2 } = await deployAndCreateCollectionsAndMint();

      await collection.batchTransferForSale(manufacturer.address, user.address, 1, 2);
      const collectionWithCaller = await caller(collection, user.address);

    
      });


      it("Batch transfer for service failed", async () => {
        const { collection, manufacturer, user } = await deployAndCreateCollectionsAndMint();
        
        await expect(collection.transferForService(manufacturer.address, user.address, 1, "SN772626", 2022))
          .to.revertedWith("Not on sale")
      });

      it("Transfer success", async () => {
        const { collection, manufacturer, user, user2 } = await deployAndCreateCollectionsAndMint();
        
        await collection.batchTransferForSale(manufacturer.address, user.address, 1, 2);
        let collectionWithCaller = await caller(collection, user.address);
        await collectionWithCaller.transferForService(user.address, user2.address, 1, "SN772626",2022)

        collectionWithCaller = await caller(collection, user2.address);

        await expect(collectionWithCaller.transferFrom(user2.address, user.address, 1))
          .to.emit(collection, "Transfer")
          .withArgs(user2.address, user.address, 1);
      });

      it("Transfer failed", async () => {
        const { collection, manufacturer, user, user2 } = await deployAndCreateCollectionsAndMint();
        
        await expect(collection.transferFrom(manufacturer.address, user.address, 1))
          .to.revertedWith("Idle mode")
      });
    }) 

   
    describe("Token URI", () => {
      it("Get token URI success", async () => {
        const { collection } = await deployAndCreateCollectionsAndMint();
        expect(await collection.tokenURI(1)).to.be.a("string").and.satisfy(v => v.startsWith("data:application/json;base64,"));
      });
      
      it("Get token URI failed", async () => {
        const { collection } = await deployAndCreateCollectionsAndMint();
        await expect( collection.tokenURI(12)).to.be.revertedWith("ERC721: invalid token ID");
      });
    })
  });

});
