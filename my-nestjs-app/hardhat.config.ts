import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// hardhat.config.ts
// 👇 动态选择加载哪个 .env 文件
const envFile = `.env.${process.env.ENV || "local"}`;
const envPath = path.resolve(__dirname, envFile);

// 如果文件存在，就加载
if (fs.existsSync(envPath)) {
  console.warn(`⚠️ 环境文件 ${envFile} 找到，使用${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`⚠️ 环境文件 ${envFile} 未找到，使用默认 .env`);
  dotenv.config();
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: false, // 👈 关闭优化器，和 Remix 保持一致
      },
      // evmVersion: "paris", // 推荐paris，remix默认是prague
    },
  },
  networks: {
    sepolia: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.ADMIN_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY!
    }
  },
  paths: {
    sources: "./contracts", // 👈 告诉 Hardhat 合约文件在哪
    artifacts: "./src/typechain-types/abi", // 可选，生成 ABI 的位置
  },
  typechain: {
    outDir: "./src/typechain-types",
    target: "ethers-v6",
  },
};

export default config;
