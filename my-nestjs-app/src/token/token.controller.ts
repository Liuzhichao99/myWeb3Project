import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return {
      address,
      balance: await this.tokenService.getBalance(address),
    };
  }

  @Post('mint')
  async mint(@Body() body: { to: string; amount: string }) {
    const { to, amount } = body;
    const txHash = await this.tokenService.mint(to, amount);
    return {
      success: true,
      txHash,
    };
  }

  @Post('transfer')
  async transfer(
    @Body() body: { from: string; to: string; amount: string },
  ) {
    const { from, to, amount } = body;
    const txHash = await this.tokenService.transfer(from, to, amount);
    return {
      success: true,
      txHash,
    };
  }
} 