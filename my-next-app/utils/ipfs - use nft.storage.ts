import { NFTStorage, File } from 'nft.storage';

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN!;

export async function uploadToIPFS(file: File, name: string, description: string) {
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const metadata = await client.store({
    name,
    description,
    image: file,
  });
  return metadata.url; // ipfs://... 
} 