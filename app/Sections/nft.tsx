"use client";
import { useEffect, useState } from "react";

type NftsPageProps = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
};

type Nft = {
  title?: string;
  description?: string;
  resolvedImage: string;
  contract?: {
    openSeaMetadata?: {
      imageUrl?: string;
      bannerImageUrl?: string;
      floorPrice?: number;
    };
  };
  contractMetadata?: {
    openSea?: {
      floorPrice?: number;
    };
  totalSupply: number,    
  tokenType: string
  name: string

  };

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
        console.log(data.nfts)
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
      <div className="w-full flex justify-center p-10">
     <input
  type="text"
  value={wallet}
  onChange={(e) => setWallet(e.target.value)}
  placeholder="Enter wallet address"
  className="border rounded-full mb-4 px-5 py-3 w-full max-w-md outline-none bg-amber-50 text-center placeholder:text-center placeholder:text-slate-400"
/>

      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-500">Loading NFTs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* NFTs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden
             hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] group"
          >
            <img
              src={nft.resolvedImage || "/placeholder.png"}
              alt={nft.title || nft.description || "NFT"}
              className="w-full h-64 object-cover transition-opacity duration-300"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/fallback.jpeg")
              }
            />

            <div className="p-4 space-y-2 text-center">
              <p className="font-semibold text-white">
                {nft.title || nft.contractMetadata?.name || "Untitled NFT"}
              </p>

              {nft.contractMetadata?.openSea?.floorPrice ? (
                <p className="text-sm text-gray-300">
                  Floor price:{" "}
                  {nft.contractMetadata.openSea.floorPrice.toFixed(4)} ETH
                </p>
              ) : (
                <p className="text-sm text-gray-500">No floor price</p>
              )}

                   <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Total supply: {nft.contractMetadata?.totalSupply}</span>
          {nft.contractMetadata?.tokenType && (
            <span className="px-2 py-1 bg-slate-700/50 rounded">{nft.contractMetadata.tokenType}</span>
          )}
        </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
