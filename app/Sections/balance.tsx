import React, { useEffect, useState } from 'react';

type BalanceProps = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
};

type ChainBalance = {
  chain: string;
  native: string | null;
  usdt: number | null;
  error?: string;
};

type WalletBalance = {
  address: string;
  balances: ChainBalance[];
};

export default function Balance({ wallet,setWallet }: BalanceProps) {
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (!wallet) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/broswer?address=${wallet}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `Failed to fetch balances (${res.statusText})`);
        }

        const data = await res.json();
        setWalletBalance(data);
      } catch (err) {
            const error = err as Error;
    setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [wallet]);

  return (
    <div className='w-full p-5'>
       {walletBalance &&
         <div className='flex justify-center p-5 '>
      <h2 className="text-6xl text-amber-50 font-bold mb-4">Wallet Balances</h2>

      </div>}
      {error && <p className="text-red-500">{error}</p>}
      <div className='flex justify-center'>
      {walletBalance && (
        <div className="flex gap-5 flex-col md:flex-row ">
          {walletBalance.balances.map((chain) => (
            <div
              key={chain.chain}
              className="border border-amber-200 p-10 rounded shadow hover:shadow-lg transition "
            >
              <h3 className="font-semibold capitalize text-6xl text-white">{chain.chain}</h3>
              {chain.error ? (
                <p className="text-red-500">{chain.error}</p>
              ) : (
                <>
                  <p className='text-white p-5'>ETH Balance: {chain.native ?? "0"}</p>
                  <p className='text-white p-5'>USDT Balance: {chain.usdt ?? 0}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
