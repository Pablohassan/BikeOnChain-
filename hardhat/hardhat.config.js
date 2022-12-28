require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

const {PROVIDER_GOERLI_URL, PROVIDER_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.17",

    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    mumbai: {
      url: PROVIDER_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    goerli:{url: PROVIDER_GOERLI_URL,
    accounts: [`0x${PRIVATE_KEY}`]

    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
      currency: 'EUR',
      gasPrice: 21
    
  }
};
