import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

const tokenABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private adminWallet: ethers.Wallet;

  constructor() {
    if (!process.env.ADMIN_PRIVATE_KEY || !process.env.TOKEN_CONTRACT_ADDRESS) {
      throw new Error('Missing required environment variables');
    }

    // 连接到以太坊网络（这里使用 Sepolia 测试网）
    this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    
    // 初始化管理员钱包
    this.adminWallet = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY,
      this.provider
    );

    // 初始化合约实例
    this.contract = new ethers.Contract(
      process.env.TOKEN_CONTRACT_ADDRESS,
      tokenABI,
      this.adminWallet
    );
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async mint(to: string, amount: string): Promise<string> {
    const amountWei = ethers.parseEther(amount);
    const tx = await this.contract.mint(to, amountWei);
    await tx.wait();
    return tx.hash;
  }

  async transfer(from: string, to: string, amount: string): Promise<string> {
    const amountWei = ethers.parseEther(amount);
    const tx = await this.contract.transfer(to, amountWei);
    await tx.wait();
    return tx.hash;
  }
} 