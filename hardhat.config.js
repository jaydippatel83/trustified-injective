require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./tasks");
require("dotenv").config();

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY; 

module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: process.env.REACT_APPA_POLYGONSCAN_API_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
  defaultNetwork: "inEVM",
  networks: {
    hardhat: {},
    inEVM: {
      url: "https://inevm-rpc.caldera.dev/",  
      chainId: 1738, 
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
      accounts: [PRIVATE_KEY],
    }, 
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/1KY8SXPno-ao61fhLtpTBD4mBZvesVIC",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  mocha: {
    timeout: 400000000,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
