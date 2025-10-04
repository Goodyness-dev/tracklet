import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // for formatting ETH values

type TransactionProps = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
};

type Tx = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
};

export default function Transaction({ wallet }: TransactionProps) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // page for pagination
  const [hasMore, setHasMore] = useState(false); // track if more txs exist

  // Fetch transactions when wallet or page changes
  useEffect(() => {
    if (!wallet) return;

    async function fetchTxs() {
      setLoadingTxs(true);
      setError(null);

      try {
        const res = await fetch(`/api/transaction?address=${wallet}&page=${page}&offset=100`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();

        if (data.transactions && data.transactions.length > 0) {
          // Append new transactions
          setTxs((prev) => [...prev, ...data.transactions]);
           setHasMore(data.transactions.length === 100);
        } else {
          // If no transactions returned, disable "Load More"
          setHasMore(false);
        }
      } catch (err) {
            const error = err as Error;
    setError(error.message || "Something went wrong");
   
      } finally {
        setLoadingTxs(false);
      }
    }

    fetchTxs();
  }, [wallet, page]);

  return (
    <div className="p-4">

{txs.length> 0 &&
<div className="flex justify-center p-8">
        <h2 className="text-6xl text-white font-bold mb-3">Transactions</h2>
      </div>
}

      {loadingTxs && page === 1 && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-center items-center">
        <ul className="space-y-5 w-fit items-center">
          {txs.length > 0 ? (
            txs.map((tx) => (
          <li
  key={tx.hash}
  className="border border-amber-200 rounded-lg shadow-sm mx-auto w-full max-w-md my-4 px-4 sm:px-6"
>
  <div>
    <p className="p-2 sm:p-4">
      <span className="font-medium text-white">Hash:</span>{" "}
      <a
        href={`https://etherscan.io/tx/${tx.hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {tx.hash.slice(0, 10)}...
      </a>
    </p>
    <p className="text-amber-50 p-2 sm:p-4">
      <span className="font-medium">From:</span> {tx.from}
    </p>
    <p className="text-amber-50 p-2 sm:p-4">
      <span className="font-medium">To:</span> {tx.to}
    </p>
    <p className="text-amber-50 p-2 sm:p-4">
      <span className="font-medium">Value:</span>{" "}
      {ethers.formatEther(tx.value)} ETH
    </p>
    <p className="text-amber-50 p-2 sm:p-4">
      <span className="font-medium">Date:</span>{" "}
      {new Date(Number(tx.timeStamp) * 1000).toLocaleString()}
    </p>
  </div>
</li>

            ))
          ) : (
            <p className="text-gray-900">No transactions found</p>
          )}
        </ul>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loadingTxs}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-500"
          >
            {loadingTxs ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
