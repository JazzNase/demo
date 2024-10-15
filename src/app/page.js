'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import axios from 'axios';

function NFTTransactions({ transactions }) {
  return (
    <div className="mt-8 w-full max-w-6xl">
      <h2 className="text-2xl font-bold mb-4">NFT Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Transaction Hash</th>
              <th className="py-2 px-4 border-b">Block Number</th>
              <th className="py-2 px-4 border-b">Date Time (UTC)</th>
              <th className="py-2 px-4 border-b">From</th>
              <th className="py-2 px-4 border-b">To</th>
              <th className="py-2 px-4 border-b">Token ID</th>
              <th className="py-2 px-4 border-b">Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">{tx.hash.slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.blockNumber}</td>
                <td className="py-2 px-4 border-b">{new Date(parseInt(tx.timeStamp) * 1000).toUTCString()}</td>
                <td className="py-2 px-4 border-b">{tx.from.slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.to.slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.tokenID}</td>
                <td className="py-2 px-4 border-b">{tx.from === '0x0000000000000000000000000000000000000000' ? 'Create Token' : 'Transfer'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  const [nftTransactions, setNftTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTTransactions = async () => {
      try {
        const CONTRACT_ADDRESS = '0xedc38b1ff69dd823c251e7094d6ddfd42af9aba4';
        const API_ENDPOINT = 'https://api.polygonscan.com/api';
        const API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY;

        const response = await axios.get(API_ENDPOINT, {
          params: {
            module: 'account',
            action: 'tokennfttx',
            contractaddress: CONTRACT_ADDRESS,
            startblock: 0,
            endblock: 99999999,
            sort: 'desc',
            apikey: API_KEY
          }
        });

        if (response.data.status === '1') {
          setNftTransactions(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch NFT transactions');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTTransactions();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold mb-4">NFT Transaction Viewer</h1>
        {isLoading ? (
          <p>Loading NFT transactions...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <NFTTransactions transactions={nftTransactions} />
        )}
      </main>
    </div>
  );
}