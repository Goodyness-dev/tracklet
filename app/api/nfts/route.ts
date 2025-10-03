import { NextResponse } from "next/server";
type OwnedNft={
  
  image?: {
    cachedUrl?: string;
    pngUrl?: string;
    thumbnailUrl?: string;
  };
  contractMetadata?: {
    imageUrl?: string;
    openSeaMetadata?: {
      imageUrl?: string;
      bannerImageUrl?: string;
    };
    openSea:{
      bannerImageUrl: string
    }
  };
  resolvedImage?: string;
  contract?: {
    openSeaMetadata: {
      bannerImageUrl: string
    }

  }
    media?: {
    gateway?: string;
    raw?: string;
    thumbnail?: string;
    format?: string;
  }[];
   rawMetadata?:{
    image: string
   }
};  


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner")?.toLowerCase();

    if (!owner) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    const apiKey = process.env.ALCHEMY_KEY;
    if (!apiKey) {
      console.error("Alchemy API key not found");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 🔹 Fetch NFTs from Alchemy
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/?owner=${owner}&withMetadata=true`;
    const alchemyRes = await fetch(alchemyUrl);

    if (!alchemyRes.ok) {
      const text = await alchemyRes.text();
      return NextResponse.json({ error: " fetch failed", details: text }, { status: 500 });
    }

    const data = await alchemyRes.json();
    const ownedNFTs = data.ownedNfts || [];

    // 🔹 Helper: convert ipfs:// to https://ipfs.io/ipfs/
    const convertUrl = (url?: string) => {
      if (!url) return null;
      return url.startsWith("ipfs://")
        ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
        : url;
    };

    // 🔹 Enrich NFTs with resolvedImage
    const enrichedNFTs = ownedNFTs.map((nft:OwnedNft) => {
      let imageUrl =
        nft.media?.[0]?.gateway || // ✅ Primary Alchemy media
        nft.image?.cachedUrl || // ✅ Alchemy cached
        nft.image?.pngUrl || // ✅ PNG fallback
        nft.image?.thumbnailUrl || // ✅ Thumbnail
        nft.rawMetadata?.image || // ✅ Sometimes only in raw metadata
             nft.contractMetadata?.openSea.bannerImageUrl
        nft.contract?.openSeaMetadata?.bannerImageUrl || // ✅ Another OpenSea fallback
   
              nft.contractMetadata?.imageUrl
        null;

      if (!imageUrl) {
        imageUrl = "/placeholder.png"; // 🚨 Last fallback
      }

      return {
        ...nft,
        resolvedImage: convertUrl(imageUrl) || "/placeholder.png",
        contract: {
          ...nft.contract,
          openSeaMetadata: nft.contract?.openSeaMetadata || {},
        },
      };
    });

    return NextResponse.json({ nfts: enrichedNFTs });
  } catch (error: unknown) {
  const err = error as Error;
  console.error("Route crashed:", err);

  return NextResponse.json(
    { error: "Server error", details: err.message },
    { status: 500 }
  );
}

}
