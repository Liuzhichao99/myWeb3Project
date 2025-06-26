// scripts/deploy.ts
import { ethers } from "hardhat";
import { ValueType } from "../typechain-types"; // 导入自动生成的类型

async function main() {
const valuetype2Factory = await ethers.getContractFactory("ValueType");
  const myValuetype2 = (await valuetype2Factory.deploy()) as ValueType; // 强制类型转换

  await myValuetype2.waitForDeployment();

  console.log("合约部署成功，地址：", await myValuetype2.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
