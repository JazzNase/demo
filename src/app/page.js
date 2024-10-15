'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";

function NFTTransactions({ transactions }) {
  const getModifiedMethod = (method) => {
    switch (method) {
      case "Create Token":
        return "Mint NFT";
      case "Execute Sale":
        return "Bought";
      case "Cancel Sale":
        return "Cancel Sale";
      default:
        return method;
    }
  };

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
                <td className="py-2 px-4 border-b">{tx["Transaction Hash"].slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.Blockno}</td>
                <td className="py-2 px-4 border-b">{tx["DateTime (UTC)"]}</td>
                <td className="py-2 px-4 border-b">{tx.From.slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.To.slice(0, 10)}...</td>
                <td className="py-2 px-4 border-b">{tx.Token_ID || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{getModifiedMethod(tx.Method)}</td>
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
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/csvjson-cUj9QMiHs6tRBDXRo01qQO2x923DJQ.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setNftTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
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