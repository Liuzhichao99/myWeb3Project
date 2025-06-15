import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('mint')
  async mintNFT(@Body() body: { address: string; tokenURI: string }) {
    console.log('mintNFT body:', body);
    const txHash = await this.nftService.mint(body.address, body.tokenURI);
    return { txHash };
  }

  @Get('nfts/:address')
  async getNFTs(@Param('address') address: string) {
    return this.nftService.tokensOfOwner(address);
  }
} 