import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const page = searchParams.get("page") || "1"; // default page = 1
    const offset = searchParams.get("offset") || "100"; // default 100 txs

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY_ETHERSCAN!;
    const chainId = 1; // Ethereum mainnet

    const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=${page}&offset=${offset}&apikey=${apiKey}`;

    console.log("Fetching from:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1") {
      return NextResponse.json(
        { error: "Etherscan error", details: data },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transactions: data.result,
      pagination: {
        page: Number(page),
        offset: Number(offset),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
