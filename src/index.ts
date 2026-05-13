interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Blockstream.info Esplora MCP — Bitcoin block/tx/address explorer.
 *
 * Auth: none. Docs: https://github.com/Blockstream/esplora/blob/master/API.md
 */


const UA = 'pipeworx-mcp-blockstream-info/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'tip_height',
    description: 'Current block height of the chain tip.',
    inputSchema: {
      type: 'object',
      properties: { network: { type: 'string', description: 'mainnet (default) | testnet' } },
    },
  },
  {
    name: 'block',
    description: 'Block by 64-char hex hash or by height.',
    inputSchema: {
      type: 'object',
      properties: {
        hash_or_height: { type: 'string', description: 'Block hash (hex) or numeric height as string.' },
        network: { type: 'string' },
      },
      required: ['hash_or_height'],
    },
  },
  {
    name: 'transaction',
    description: 'Transaction details by txid.',
    inputSchema: {
      type: 'object',
      properties: { txid: { type: 'string' }, network: { type: 'string' } },
      required: ['txid'],
    },
  },
  {
    name: 'tx_status',
    description: 'Confirmation status for a txid (block_height, block_hash, confirmed).',
    inputSchema: {
      type: 'object',
      properties: { txid: { type: 'string' }, network: { type: 'string' } },
      required: ['txid'],
    },
  },
  {
    name: 'address',
    description: 'Address summary (chain + mempool stats).',
    inputSchema: {
      type: 'object',
      properties: { address: { type: 'string' }, network: { type: 'string' } },
      required: ['address'],
    },
  },
  {
    name: 'address_txs',
    description: 'Recent transactions for an address (mempool + confirmed).',
    inputSchema: {
      type: 'object',
      properties: { address: { type: 'string' }, network: { type: 'string' } },
      required: ['address'],
    },
  },
  {
    name: 'mempool',
    description: 'Mempool size + fee histogram.',
    inputSchema: { type: 'object', properties: { network: { type: 'string' } } },
  },
  {
    name: 'fee_estimates',
    description: 'Recommended sat/vB by confirmation target.',
    inputSchema: { type: 'object', properties: { network: { type: 'string' } } },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'tip_height':
      return numberJson(bsGet('/blocks/tip/height', args));
    case 'block': {
      const hoh = reqStr(args, 'hash_or_height', '"840000" or hash');
      const path = /^[0-9]+$/.test(hoh) ? `/block-height/${hoh}` : `/block/${hoh}`;
      if (/^[0-9]+$/.test(hoh)) {
        const hashRes = await fetch(`${base(args)}${path}`, { headers: hdrs() });
        if (!hashRes.ok) throw new Error(`Blockstream: ${hashRes.status}`);
        const hash = (await hashRes.text()).trim();
        return bsGet(`/block/${hash}`, args);
      }
      return bsGet(path, args);
    }
    case 'transaction':
      return bsGet(`/tx/${encodeURIComponent(reqStr(args, 'txid', '"<txid>"'))}`, args);
    case 'tx_status':
      return bsGet(`/tx/${encodeURIComponent(reqStr(args, 'txid', '"<txid>"'))}/status`, args);
    case 'address':
      return bsGet(`/address/${encodeURIComponent(reqStr(args, 'address', '"bc1q..."'))}`, args);
    case 'address_txs':
      return bsGet(`/address/${encodeURIComponent(reqStr(args, 'address', '"bc1q..."'))}/txs`, args);
    case 'mempool':
      return bsGet('/mempool', args);
    case 'fee_estimates':
      return bsGet('/fee-estimates', args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function base(args: Record<string, unknown>): string {
  const net = ((args.network as string) ?? 'mainnet').toLowerCase();
  if (net !== 'mainnet' && net !== 'testnet') throw new Error('network must be "mainnet" or "testnet".');
  return net === 'testnet' ? 'https://blockstream.info/testnet/api' : 'https://blockstream.info/api';
}

function hdrs(): HeadersInit {
  return { Accept: 'application/json', 'User-Agent': UA };
}

async function bsGet(path: string, args: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${base(args)}${path}`, { headers: hdrs() });
  if (res.status === 404) throw new Error('Blockstream: not found');
  if (!res.ok) throw new Error(`Blockstream: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  // Several endpoints return raw text (height, hash). Detect by content-type.
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return res.json();
  return { value: (await res.text()).trim() };
}

async function numberJson(p: Promise<unknown>): Promise<unknown> {
  const r = (await p) as { value?: string };
  if (r && typeof r.value === 'string' && /^[0-9]+$/.test(r.value)) return { height: Number(r.value) };
  return r;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
