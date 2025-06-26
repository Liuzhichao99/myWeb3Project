
hardhat说明
配置文件说明
hardhat.config.js

命令	说明
npx hardhat compile	编译合约
npx hardhat console	打开交互式控制台
npx hardhat node	启动本地测试链
npx hardhat run scripts/deploy.js	执行脚本部署合约
npx hardhat test	运行测试

一、编译合约
npx hardhat compile
成功后生成 artifacts/ 和 cache/ 目录，包含 ABI 和字节码等中间产物。

二、运行本地链（Hardhat 内置节点）
npx hardhat node

你会看到类似如下输出：

vbnet
复制
编辑
Hardhat Network started
Accounts:
  0x5Fb... (10000 ETH)
  0xAb8...
Private Keys:
  0x59c... 

✅ Hardhat 的结构设计是“分阶段的”：
阶段	命令	作用
编写合约	.sol 文件	只是代码文件，还没部署
编译合约	npx hardhat compile	生成 ABI 和 Bytecode，准备好部署材料
运行本地链	npx hardhat node	启动一个本地以太坊区块链，提供账户和 RPC
部署合约	npx hardhat run scripts/deploy.ts	真正把合约发布到链上

✅ 部署合约才是关键的一步：
你需要写一个 deploy.ts 或 deploy.js 脚本：


// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("MyContract");
  const contract = await ContractFactory.deploy();

  await contract.deployed();

  console.log("合约部署成功，地址：", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
然后执行：


npx hardhat run scripts/deploy.ts --network localhost
这时候合约才会真正部署到你运行的本地链上。

下面是发布的测试网
npx hardhat run scripts/deploy.ts --network sepolia


🚀 为什么还要本地链？
本地链用于：

快速部署、调试合约

不花任何 ETH

支持自动挖矿（每个交易都会立刻执行）

提供 20 个默认账户（全是有 10000 ETH 的测试钱包）

你可以在 npx hardhat node 的控制台看到它监听的端口和账户私钥。

✅ 总结
你做的	实际意义	下一步
compile	✅ 生成 ABI/Bytecode	✳️ 编写部署脚本
node	✅ 启动链	✳️ 使用脚本部署合约到这条链
没看到部署？	因为你没运行部署命令	npx hardhat run scripts/deploy.ts --network localhost

✅ 接下来你可以做的几件事：
1. 与部署合约交互
在 scripts/interact.ts 里添加一个脚本，比如调用合约的某个方法。

2. 查看本地链状态
Hardhat 本地链也提供了一个区块链节点，你可以通过 ethers.js 连上它模拟前端交互。

3. 部署到测试网（如 Sepolia）
当你准备部署到真实网络，可以添加如下配置：

比如用浏览器的前端代码连接：

三、交互（可选）
npx hardhat console --network localhost






四、可选：添加 ethers.js 和 dotenv
npm install ethers dotenv


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
