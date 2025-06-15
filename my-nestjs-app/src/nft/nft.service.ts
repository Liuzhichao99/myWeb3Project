import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SimpleNFT } from '../typechain-types/contracts/SimpleNFT'; // 自动生成的合约类型
import { SimpleNFT__factory } from '../typechain-types/factories/contracts/SimpleNFT__factory';

@Injectable()
export class NftService {
  private provider: ethers.JsonRpcProvider;
  private admin: ethers.Wallet;
  private contract: SimpleNFT;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    this.admin = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, this.provider);
    this.contract = SimpleNFT__factory.connect(
      process.env.NFT_CONTRACT_ADDRESS!,
      this.admin
    );
  }

  async mint(address: string, tokenURI: string): Promise<string> {
    const tx = await this.contract.mint(tokenURI);
    await tx.wait();
    return tx.hash;
  }

  async tokensOfOwner(address: string): Promise<{ tokenId: string; tokenURI: string }[]> {
    const tokenIds = await this.contract.tokensOfOwner(address);
    const uris = await Promise.all(
      tokenIds.map((id) => this.contract.tokenURI(id))
    );
    return tokenIds.map((id, i) => ({
      tokenId: id.toString(),
      tokenURI: uris[i],
    }));
  }
}
