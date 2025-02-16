import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  defaultNetwork: "holesky",

  networks: {
    holesky: {
      url: process.env.HOLESKY_RPC_URL as string,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 17000,
      gasPrice: 3000000000,
      gas: 600000,
    },

    anvil: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
  },

  mocha: {
    timeout: 600000 // 10 minutes
  }
};

export default config;
