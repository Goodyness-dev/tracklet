// components/NftsContainer.tsx
"use client";
import { useState, useEffect } from "react";
import NftsPage from "../Sections/nft";
 type WalletProps = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
};
type Nft = {
  title?: string;
  description?: string;
  resolvedImage: string;
  contract?: {
    openSeaMetadata?: {
      floorPrice?: number;
    };
  };
};

export default function NftsContainer({wallet, setWallet}: WalletProps) {

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) return;

    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/nfts?owner=${wallet}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `Failed to fetch NFTs: ${res.statusText}`);
        }

        const data = await res.json();
        setNfts(data.nfts || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet]);

  return (
    <NftsPage
      wallet={wallet}
      setWallet={setWallet}
      nfts={nfts}
      loading={loading}
      error={error}
    />
  );
}
