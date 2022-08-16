const hre = require("hardhat");

async function main() {
  const NFTMarketplaceContract = await hre.ethers.getContractFactory(
    "NFTMarketplace"
  );
  const NFTMarketplace = await NFTMarketplaceContract.deploy();

  await NFTMarketplace.deployed();

  console.log("NFT MARKETPLACE CONTRACT ADDRESS : ", NFTMarketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
