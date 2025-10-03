import { NextResponse } from "next/server";

const apikey = process.env.ALCHEMY_KEY!;
const CHAINS = {
  ethereum: `https://eth-mainnet.g.alchemy.com/v2/${apikey}`,
  polygon: process.env.ALCHEMY_KEY_POLYGON!,
  arbitrum: process.env.ALCHEMY_KEY_ARBITRUM!,
  optimism: process.env.ALCHEMY_KEY_OPTIMISM!,
  base: process.env.ALCHEMY_KEY_BASE!,
};

export async function GET(request:Request) {
    try{
        const{ searchParams} =  new URL(request.url)
        const address = searchParams.get("address")

        if(!address){
            return NextResponse.json({ error: "Address is required" }, { status: 400 });
        }
        const txPromises = Object.entries(CHAINS).map(async([Chain,rpcurl])=> {
            try{
                const res = await fetch(rpcurl, {
                    method:"POST",
                    headers: { "Content-Type": "application/json" },
                    
                })
            }
        })
    }
    
}