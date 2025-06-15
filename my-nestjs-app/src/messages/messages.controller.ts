import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ethers } from 'ethers';
import { MessagesResponse } from './types';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<MessagesResponse> {
    return this.messagesService.getMessages(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Post()
  async postMessage(
    @Body() body: { content: string; signature: string; message: string },
  ) {
    if (!process.env.ADMIN_PRIVATE_KEY) {
      throw new Error('Missing ADMIN_PRIVATE_KEY environment variable');
    }

    const { content, signature, message } = body;
    
    // 验证签名
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // 创建签名者
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    
    // 发送交易
    const txHash = await this.messagesService.postMessage(signer, content);
    
    return {
      success: true,
      txHash,
      sender: recoveredAddress,
    };
  }
} 