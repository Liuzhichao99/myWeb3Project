import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
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
