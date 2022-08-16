require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

// npx hardhat run scripts/deploy.js --network networkname

// Goerli NFT MARKETPLACE v2 CONTRACT ADDRESS : 0xD29f2b31dc14C362b329942A2c3fF9aECF66Df9c

// Goerli NFT MARKETPLACE v3 CONTRACT ADDRESS : 0xBCF91381Dd29aCB1778F2eC63022f5f0ff88cB0B
