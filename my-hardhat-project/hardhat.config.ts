import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // 👈 指定加载 .env.local

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: process.env.ETHEREUM_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
