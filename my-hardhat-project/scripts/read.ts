import { ethers } from "hardhat";

async function main() {
  // 部署地址，替换为你真实部署后获得的地址
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // 获取合约实例（ValueType 是你定义的合约名）
  const contract = await ethers.getContractAt("ValueType", contractAddress);

  // 调用合约的公开变量（其实是自动生成的 getter 函数）
  const intValue = await contract._int();
  const uintValue = await contract._uint();
  const number = await contract._number();
  const number1 = await contract._number1();
  const number2 = await contract._number2();
  const number3 = await contract._number3();
  const numberbool = await contract._numberbool();

  // 打印结果
  console.log("_int:", intValue.toString());
  console.log("_uint:", uintValue.toString());
  console.log("_number:", number.toString());
  console.log("_number1:", number1.toString());
  console.log("_number2:", number2.toString());
  console.log("_number3:", number3.toString());
  console.log("_numberbool:", numberbool);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
