'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function TokenPage() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api-backend1/token/balance/${address}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error checking balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api-backend1/token/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: address,
          to: recipient,
          amount,
        }),
      });
      const data = await response.json();
      alert(`Transfer successful! Transaction hash: ${data.txHash}`);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Transfer failed. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Token Operations</h1>
      
      <div className="space-y-6">
        {/* Balance Check */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Check Balance</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={checkBalance}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Check Balance
            </button>
          </div>
          {balance && (
            <p className="mt-4">
              Balance: {balance} tokens
            </p>
          )}
        </div>

        {/* Transfer Tokens */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Transfer Tokens</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 