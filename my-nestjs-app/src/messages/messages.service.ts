import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Message, MessagesResponse } from './types';

type MessageBoardContract = ethers.Contract & {
  postMessage(content: string): Promise<ethers.ContractTransactionResponse>;
  getMessageCount(): Promise<bigint>;
  getMessage(index: number): Promise<[string, string, bigint]>;
};

const messageBoardABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "postMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessageCount",
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
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getMessage",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

@Injectable()
export class MessagesService {
  private provider: ethers.JsonRpcProvider;
  private contract: MessageBoardContract;

  constructor() {
    if (!process.env.MESSAGE_BOARD_ADDRESS) {
      throw new Error('Missing MESSAGE_BOARD_ADDRESS environment variable');
    }

    this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    this.contract = new ethers.Contract(
      process.env.MESSAGE_BOARD_ADDRESS,
      messageBoardABI,
      this.provider
    ) as unknown as MessageBoardContract;
  }

  async getMessages(page: number = 1, limit: number = 10): Promise<MessagesResponse> {
    const total = await this.contract.getMessageCount();
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, Number(total));

    const messages: Message[] = [];
    for (let i = start; i < end; i++) {
      const [sender, content, timestamp] = await this.contract.getMessage(i);
      messages.push({
        sender,
        content,
        timestamp: new Date(Number(timestamp) * 1000).toISOString(),
      });
    }

    return {
      messages,
      total: Number(total),
      page,
      limit,
    };
  }

  async postMessage(signer: ethers.Signer, content: string) {
    const contractWithSigner = this.contract.connect(signer) as MessageBoardContract;
    const tx = await contractWithSigner.postMessage(content);
    await tx.wait();
    return tx.hash;
  }
} 