import { ethers } from "hardhat";

async function main() {
    // MessageBoard.sol 里没有写constructor，所以直接部署即可
    // 1. 获取合约工厂（合约名必须和 .sol 文件中的 contract 名一致）
    const MessageBoard = await ethers.getContractFactory("MessageBoard")
    
    // 2. 部署合约（无构造函数参数，直接 deploy 即可）
    console.log("🚀 正在部署 MessageBoard 合约...");
    const contract = await MessageBoard.deploy();

    // 3. 等待部署完成（确保部署上链）
    await contract.waitForDeployment();

    // 4. 打印部署地址
    const contractAddress = await contract.getAddress();
    console.log(`✅ 部署成功！合约地址: ${contractAddress}`);
}

main().catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exitCode = 1;
});