'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    loadMessages();
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setProvider(provider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api-backend1/messages');
      const data = await response.json();
      setMessages(data?.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !provider || !newMessage.trim()) return;

    try {
      setLoading(true);
      
      // 创建要签名的消息
      const message = `Post message: ${newMessage}`;
      
      // 请求签名
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // 发送到后端
      const response = await fetch('/api-backend1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          signature,
          message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        await loadMessages();
        alert('Message posted successfully!');
      }
    } catch (error) {
      console.error('Error posting message:', error);
      alert('Failed to post message. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blockchain Message Board</h1>

        {/* Wallet Connection */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          {account ? (
            <p className="text-sm">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your message..."
              className="flex-1 p-2 border rounded"
              maxLength={280}
              disabled={!account || loading}
            />
            <button
              type="submit"
              disabled={!account || loading || !newMessage.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>

        {/* Messages List */}
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">
                From: {message.sender.slice(0, 6)}...{message.sender.slice(-4)}
              </p>
              <p className="mb-2">{message.content}</p>
              <p className="text-gray-500 text-sm">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 