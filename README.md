# @pipeworx/blockstream-info

Blockstream Bitcoin block explorer MCP — Esplora API at blockstream.info. Mainnet by default; pass `network: "testnet"` for testnet. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `tip_height(network?)` — current block height
- `block(hash_or_height, network?)` — block by hash or height
- `transaction(txid, network?)` — transaction details
- `tx_status(txid, network?)` — confirmation status
- `address(address, network?)` — address summary (chain + mempool stats)
- `address_txs(address, network?)` — recent transactions for an address
- `mempool(network?)` — mempool size + fee histogram
- `fee_estimates(network?)` — recommended sat/vB by confirmation target

## Data source

`https://blockstream.info/api/` (mainnet) and `https://blockstream.info/testnet/api/` (testnet) — both serve the [Esplora REST API](https://github.com/Blockstream/esplora/blob/master/API.md).

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "blockstream-info": {
      "url": "https://gateway.pipeworx.io/blockstream-info/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Blockstream Info data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
