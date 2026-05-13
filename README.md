# mcp-blockstream-info

Blockstream Esplora Bitcoin block explorer (mainnet + testnet)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `tip_height` | Current block height of the chain tip. |
| `block` | Block by 64-char hex hash or by height. |
| `transaction` | Transaction details by txid. |
| `tx_status` | Confirmation status for a txid (block_height, block_hash, confirmed). |
| `address` | Address summary (chain + mempool stats). |
| `address_txs` | Recent transactions for an address (mempool + confirmed). |
| `mempool` | Mempool size + fee histogram. |
| `fee_estimates` | Recommended sat/vB by confirmation target. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
