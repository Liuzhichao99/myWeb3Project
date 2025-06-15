'use client';
import { use, useEffect, useState } from 'react';

// Next.js 会自动把 `params` 包装成一个 Promise
export default function NFTs(promiseParams: { params: Promise<{ address: string }> }) {
  const { address } = use(promiseParams.params); // 👈 这里使用 use() 解包

  const [nfts, setNfts] = useState<{ tokenId: string; tokenURI: string }[]>([]);

  useEffect(() => {
    fetch(`/api-backend1/nft/nfts/${address}`)
      .then(res => res.json())
      .then(setNfts);
  }, [address]);

  return (
    <div>
      {nfts.map(nft => (
        <div key={nft.tokenId}>
          <img src={nft.tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="NFT" width={200} />
          <p>ID: {nft.tokenId}</p>
        </div>
      ))}
    </div>
  );
}
