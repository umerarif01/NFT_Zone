const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
// const { ethers } = require("ethers");

describe("Unit testing of NFTMarketplace.sol", function () {
  async function LoadFixture() {
    const LISTING_FEE = ethers.utils.parseEther("0.025");
    let price = ethers.utils.parseEther("0.35");
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const TOKEN_URI = "https://www.mytokenlocation.com";

    const NFTMarketplaceContract = await ethers.getContractFactory(
      "NFTMarketplace"
    );
    const NFTMarketplace = await NFTMarketplaceContract.deploy();

    await NFTMarketplace.createToken(TOKEN_URI, price, {
      value: LISTING_FEE,
    });

    return {
      NFTMarketplace,
      owner,
      otherAccount,
      LISTING_FEE,
      price,
      TOKEN_URI,
    };
  }

  describe("Checking setter and getters function after deployment and creating a token", function () {
    it("Check the owner of contract", async function () {
      const { NFTMarketplace, owner } = await loadFixture(LoadFixture);
      expect(await NFTMarketplace.getOwner()).to.equal(owner.address);
    });
    it("Check the listing fee", async function () {
      const { NFTMarketplace, LISTING_FEE } = await loadFixture(LoadFixture);
      expect(await NFTMarketplace.getListingPrice()).to.equal(LISTING_FEE);
    });
    it("Change the listing fee and then check the listing fee again", async function () {
      const { NFTMarketplace } = await loadFixture(LoadFixture);
      const CHANGED_LISTING_FEE = ethers.utils.parseEther("0.015");
      await NFTMarketplace.updateListingPrice(CHANGED_LISTING_FEE);
      expect(await NFTMarketplace.getListingPrice()).to.equal(
        CHANGED_LISTING_FEE
      );
    });
    it("TokenID should be 1 and ItemsSold should be 0", async function () {
      const { NFTMarketplace } = await loadFixture(LoadFixture);

      expect(await NFTMarketplace.getTokenID()).to.equal(1);
      expect(await NFTMarketplace.getItemsSold()).to.equal(0);
    });
  });
  describe("Checking createToken & createMarketItem functions", function () {
    it("TokenID should be equal to 1 after calling createToken function", async function () {
      const { NFTMarketplace } = await loadFixture(LoadFixture);
      const COUNTER = await NFTMarketplace.getTokenID();
      expect(COUNTER).to.equal(1);
    });
    it("Should revert with error (Price must be at least 1 wei)", async function () {
      const { NFTMarketplace, LISTING_FEE, TOKEN_URI } = await loadFixture(
        LoadFixture
      );
      const PRICE = ethers.utils.parseEther("0");
      await expect(
        NFTMarketplace.createToken(TOKEN_URI, PRICE, {
          value: LISTING_FEE,
        })
      ).to.be.revertedWith("Price must be at least 1 wei");
    });
    it("Should revert with error (Price must be equal to listing price)", async function () {
      const { NFTMarketplace, TOKEN_URI } = await loadFixture(LoadFixture);
      const PRICE = ethers.utils.parseEther("0.25");
      const CHANGED_LISTING_FEE = ethers.utils.parseEther("0.125");
      await expect(
        NFTMarketplace.createToken(TOKEN_URI, PRICE, {
          value: CHANGED_LISTING_FEE,
        })
      ).to.be.revertedWith("Price must be equal to listing price");
    });
  });
  describe("Checking createMarketSale function", async function () {
    it("Should revert with error (Please submit the asking price in order to complete the purchase)", async function () {
      const { NFTMarketplace, otherAccount } = await loadFixture(LoadFixture);
      const CUSTOM_PRICE = ethers.utils.parseEther("0.4");
      await expect(
        NFTMarketplace.connect(otherAccount).createMarketSale(1, {
          value: CUSTOM_PRICE,
        })
      ).to.be.revertedWith(
        "Please submit the asking price in order to complete the purchase"
      );
    });
    it("Check if the owner recieved the listing fee", async function () {
      const { NFTMarketplace, owner, price, LISTING_FEE } = await loadFixture(
        LoadFixture
      );
      const OWNER_BALANCE_BEFORE = await ethers.provider.getBalance(
        owner.address
      );
      await NFTMarketplace.connect(owner).createMarketSale(1, {
        value: price,
      });
      const OWNER_BALANCE_AFTER = await ethers.provider.getBalance(
        owner.address
      );
      const BALANCE = Math.abs(
        (
          (OWNER_BALANCE_BEFORE - OWNER_BALANCE_AFTER) /
          1000000000000000000
        ).toFixed(3)
      );
      expect(BALANCE).to.be.equal(0.025);
    });
  });

  describe("Checking resellToken function", async function () {
    it("Should revert with error (Only item owner can perform this operation)", async function () {
      const { NFTMarketplace, LISTING_FEE, otherAccount, price } =
        await loadFixture(LoadFixture);
      await expect(
        NFTMarketplace.connect(otherAccount).resellToken(1, price, {
          value: LISTING_FEE,
        })
      ).to.be.revertedWith("Only item owner can perform this operation");
    });
  });
});
