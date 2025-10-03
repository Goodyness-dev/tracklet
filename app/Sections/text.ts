import { NextResponse } from "next/server";
const apikey = process.env.ALCHEMY_KEY!;
const CHAINS = {
  ethereum: `https://eth-mainnet.g.alchemy.com/v2/${apikey}`,
  polygon: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_POLYGON!}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_ARBITRUM!}`,
  optimism: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_OPTIMISM!}`,
  base: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_BASE!}`,
};
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }
    const txPromises = Object.entries(CHAINS).map(async ([chain, rpcUrl]) => {
      try {
        console.log(`Fetching transactions for ${chain}...`);

        // Fetch incoming transfers
        const incomingRes = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getAssetTransfers",
            params: [
              {
                fromBlock: "0x0",
                toBlock: "latest",
                toAddress: address,
                category: ["external", "erc20", "erc721", "erc1155"],
                maxCount: "25",
              },
            ],
          }),
        });

        // Fetch outgoing transfers
        const outgoingRes = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "alchemy_getAssetTransfers",
            params: [
              {
                fromBlock: "0x0",
                toBlock: "latest",
                fromAddress: address,
                category: ["external", "erc20", "erc721", "erc1155"],
                maxCount: "25",
              },
            ],
          }),
        });

        const incomingData = await incomingRes.json();
        const outgoingData = await outgoingRes.json();

        // Merge results
        const allTxs = [
          ...(incomingData.result?.transfers || []),
          ...(outgoingData.result?.transfers || []),
        ];

        if (allTxs.length === 0) {
          return { chain, transactions: [], error: "No transactions found" };
        }

        return { chain, transactions: allTxs };
      } catch (err: any) {
        console.error(`Error fetching ${chain}:`, err);
        return { chain, transactions: [], error: err.message || "Failed to fetch" };
      }
    });

    const transactions = await Promise.all(txPromises);

    return NextResponse.json({ address, transactions });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}



 <div>
      <h2 className="text-xl font-bold mb-2">Transactions</h2>
      {loadingTxs && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {txs.length === 0 && !loadingTxs && <p>No transactions found</p>}

      {txs.map((chainTx) => (
        <div key={chainTx.chain} className="mb-4">
          <h3 className="font-semibold capitalize">{chainTx.chain}</h3>
          {chainTx.transactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <ul className="list-disc pl-4">
              {chainTx.transactions.map((tx: any, i: number) => (
                <li key={tx.asset + tx.value + i}>
                  {tx.from} → {tx.to} | {tx.asset || "ETH"} | {tx.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>