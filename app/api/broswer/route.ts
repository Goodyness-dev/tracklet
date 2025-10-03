import { NextResponse } from "next/server";
import { ethers } from "ethers";

const chains: Record<string, { rpc: string; usdt: string; decimals: number }> = {
  ethereum: {
    rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },

  arbitrum: {
    rpc: process.env.ALCHEMY_KEY_ARBITRUM!,
    usdt: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
  },
  optimism: {
    rpc: process.env.ALCHEMY_KEY_OPTIMISM!,
    usdt: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    decimals: 6,
  },

};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)", // (lowercase!)
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "wallet address is required" },
        { status: 400 }
      );
    }

    const balances = await Promise.all(
      Object.entries(chains).map(async ([name, { rpc, usdt, decimals }]) => {
        try {
          const provider = new ethers.JsonRpcProvider(rpc);
          const nativeBal = await provider.getBalance(address);
          const nativeFormatted = ethers.formatEther(nativeBal);

          const usdtContract = new ethers.Contract(usdt, ERC20_ABI, provider);
          const usdtBal = await usdtContract.balanceOf(address);
          const usdtFormatted = Number(ethers.formatUnits(usdtBal, decimals));

          return {
            chain: name,
            native: nativeFormatted,
            usdt: usdtFormatted,
          };
        } catch (err) {
          return {
            chain: name,
            native: null,
            usdt: null,
            error: "failed to fetch",
          };
        }
      })
    );

    return NextResponse.json({
      address,
      balances,
    });
  } catch (error) {
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Failed to fetch balance" },
    { status: 500 }
  );
}
    
  }
