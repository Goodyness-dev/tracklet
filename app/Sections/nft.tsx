"use client";
import { useEffect, useState } from "react";

type NftsPageProps = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
};

// Match backend response exactly
type Nft = {
  title?: string;
  description?: string;
  resolvedImage: string; // always comes from backend
  contract?: {
    openSeaMetadata?: {
      imageUrl?: string;
      bannerImageUrl?: string;
      floorPrice?: number;
    };
  };
  contractMetadata: {
    openSea:{
      floorPrice: number
    }
  }
};

export default function NftsPage({ wallet, setWallet }: NftsPageProps) {
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
          throw new Error(
            errData?.error || `Failed to fetch NFTs: ${res.statusText}`
          );
        }

        const data = await res.json();
        setNfts(data.nfts || []);
      
      } catch (err) {
           const error = err as Error;
    setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet]);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Input */}
      <div className="w-full flex justify-center">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet address"
          className="border rounded-full mb-4 p-3 w-full max-w-md outline-none bg-amber-50"
        />
      </div>

      {/* Heading */}
  

      {/* Loading/Error */}
      {loading && <p className="text-gray-500">Loading NFTs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* NFTs Grid */}
    
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="border rounded-xl p-3 bg-amber-100 shadow flex flex-col items-center"
          >
                <h2 className="text-xl font-bold mb-4"> NFTs</h2>
            <img
              src={nft.resolvedImage || "/placeholder.png"}
              alt={nft.title || nft.description || "NFT"}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/fallback.jpeg")
              }
            />

            <p className="font-semibold mt-2 text-center">
              {nft.title || "Untitled NFT"}
            </p>

            {nft.contractMetadata?.openSea?.floorPrice ? (
              <p className="text-lg text-gray-600">
                Floor price: {nft.contractMetadata.openSea.floorPrice.toFixed(4)} ETH
              </p>
            ) : (
              <p className="text-sm text-gray-400"></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
