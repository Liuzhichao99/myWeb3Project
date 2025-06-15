'use client';
import { useState } from 'react';

export default function MintNFT() {
  const [minted, setMinted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  // 连接钱包
  const connectWallet = async () => {
    console.log('尝试连接钱包');
    if (window.ethereum) {
      const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('连接成功，地址为', addr);
      setAccount(addr);
    } else {
      alert('请先安装 MetaMask 扩展');
    }
  };

  // 上传图片到IPFS
  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const { uploadToIPFS } = await import('../../utils/ipfs');
    const url = await uploadToIPFS(image, 'My NFT', 'Minted from Dapp');
    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://ipfs.io/ipfs/';
    // setImageUrl(url.replace('ipfs://', 'https://ipfs.io/ipfs/')); //使用的nft.storage
    setImageUrl(url); //使用pinata

    setLoading(false);
  };

  // 铸造NFT
  const handleMint = async () => {
    if (!account || !imageUrl) return;
    setLoading(true);
    const res = await fetch(`/api-backend1/nft/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, tokenURI: imageUrl }),
    });
    if (res.ok) setMinted(true);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={connectWallet}>连接钱包</button>
      <div style={{ height: '1em' }} />
      <p>钱包地址：{account}</p>
      <div style={{ height: '1em' }} />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      <div style={{ height: '1em' }} />
      <button onClick={handleUpload} disabled={!image || loading}>上传到IPFS</button>
      <div style={{ height: '1em' }} />
      {imageUrl && <img src={imageUrl} alt="预览" width={200} />}
      <div style={{ height: '1em' }} />
      <button onClick={handleMint} disabled={!imageUrl || !account || loading}>Mint NFT</button>
      <div style={{ height: '1em' }} />
      {minted && <p>Minted!</p>}
    </div>
  );
} 