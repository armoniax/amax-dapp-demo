import aplink from "../assets/aplink.svg";
import armadillo from "../assets/armadillo.svg";
import { JsSignatureProvider } from "@amax/amaxjs-v2/dist/eosjs-jssig";
import { getRPC } from "@/utils/armadillo";
import { Api } from "@amax/amaxjs-v2";
export * from "./anchor.config";
export * from "./scatter.config";

export enum WALLET {
  SCATTER = "scatter",
  ANCHOR = "anchor",
  ARMADILLO = "armadillo",
  AMAXUP = "amaxup",
}

/**
 * 是否在DApp端广播（push transaction）
 */
export const broadcast = true;

/**
 * 网络配置
 */
export const network = {
  blockchain: "amax",
  expireInSeconds: 600,
  host: "test-chain.ambt.art",
  // port: 80,
  chainId: "49e0b3cb94bf3308ff65219b6c12e5ab96fdaee52cc2a47366e17a2bbcb157fc", // Or null to fetch automatically ( takes longer )
  protocol: "https",
};

/**
 * action用例
 */
export const actions: { [key: string]: Action | Action[] } = {
  transfer: {
    account: "amax.token",
    name: "transfer",
    data: {
      from: "frank12345oo",
      to: "testuser2222",
      quantity: "0.00100000 AMAX",
      memo: "",
    },
  },
  buyram: {
    account: "amax",
    name: "buyram",
    data: {
      payer: "testuser1111",
      receiver: "testuser2222",
      quant: "0.00200000 AMAX",
    },
  },
  createNFT: {
    account: "amax.ntoken",
    name: "create",
    data: {
      issuer: "testuser1111",
      maximum_supply: 1000,
      symbol: {
        id: 1000000,
        parent_id: 0,
      },
      token_uri: "http://XXXXXX",
      ipowner: "testuser1111",
    },
  },
  actions: [
    {
      account: "amax.ntoken",
      name: "create",
      data: {
        issuer: "testuser1111",
        maximum_supply: 1000,
        symbol: {
          id: 1000000,
          parent_id: 0,
        },
        token_uri: "http://XXXXXX",
        ipowner: "testuser1111",
      },
    },
    {
      account: "amax.ntoken",
      name: "create",
      data: {
        issuer: "testuser1111",
        maximum_supply: 1000,
        symbol: {
          id: 1000000,
          parent_id: 0,
        },
        token_uri: "http://XXXXXX",
        ipowner: "testuser1111",
      },
    },
    {
      account: "amax.token",
      name: "transfer",
      data: {
        from: "testuser1111",
        to: "testuser2222",
        quantity: "0.00100000 AMAX",
        memo: "",
      },
    },
  ],
};

export const walletList: WalletListItem[] = [
  {
    title: "APLink",
    icon: aplink,
    id: WALLET.ANCHOR,
  },
  {
    title: "Armadillo",
    icon: armadillo,
    id: WALLET.ARMADILLO,
  },
];

export const ArmadilloPermission = "active";

const stringify = (...args: any[]) => JSON.stringify(args, null, 4);

function getRequiredKeys(account: PermissionLevel | undefined) {
  return stringify({
    transaction: {
      actions: [
        {
          account: "amax",
          name: "buyram",
          data: {
            payer: account?.actor,
            receiver: account?.actor,
            quant: "0.00000001 AMAX",
          },
        },
      ],
    },
    availableKeys: [account?.publicKey],
  });
}

export async function pushTransaction() {
  // testuser111
  const signatureProvider = new JsSignatureProvider([
    "5Jv1RGHLVt4CRvGWQnZ6Ckhjir29buv2oH4tGGdVyU4xNKysdWQ",
  ]);
  const rpc = getRPC();
  const api = new Api({ rpc, signatureProvider });
  const tr = await api.transact(
    {
      actions: [
        {
          authorization: [{ actor: "testuser1111", permission: "active" }],
          account: "amax.token",
          name: "transfer",
          data: {
            from: "testuser1111",
            to: "testuser2222",
            quantity: "0.00100000 AMAX",
            memo: "",
          },
        },
      ],
    },
    { broadcast: false, blocksBehind: 3, expireSeconds: 30, sign: true }
  );

  return stringify({
    transaction: tr,
    availableKeys: ["AM5CvhFPqeiyAzn6e6wJu2yzqANDsdz7KnyVKgLTWgtXb85EKfp7"],
  });
}

export const getRPCParams = (
  account: PermissionLevel | undefined
): { [key: string]: string } => ({
  get_account: stringify(account?.actor),
  get_abi: stringify("amax"),
  get_table_rows: stringify({
    code: "amax.ntoken",
    scope: "amax.ntoken",
    table: "tokenstats",
    json: true,
    limit: 1000000,
    reverse: false,
    index_position: 1,
    encode_type: "i128",
    key_type: "i128",
    upper_bound: "",
    lower_bound: "",
    show_payer: false,
  }),
  get_accounts_by_authorizers: stringify(
    [{ actor: account?.actor, permission: account?.permission }],
    [account?.publicKey]
  ),
  get_block_header_state: stringify("48810976"),
  get_block_info: stringify("48810976"),
  get_block: stringify("48810976"),
  get_code: stringify(account?.actor),
  get_code_hash: stringify(account?.actor),
  get_currency_balance: stringify("amax.token", account?.actor, "AMAX"),
  get_currency_stats: stringify("amax.token", "AMAX"),
  get_info: stringify(),
  get_raw_code_and_abi: stringify("amax"),
  getRawAbi: stringify("amax"),
  get_raw_abi: stringify("amax"),
  getRequiredKeys: getRequiredKeys(account),
  push_transaction: stringify({
    signatures: "string[]",
    compression: "number",
    serializedTransaction: "Uint8Array",
    serializedContextFreeData: "Uint8Array",
  }),
  history_get_actions: stringify(account?.actor, 1, 10),
  history_get_transaction: stringify(
    "cbd5e1910c2b19309504ce6fec6631de337045deefb57b6f12b304a9b3c3a5b3",
    1
  ),
  history_get_key_accounts: stringify(account?.publicKey, 1, 10),
  history_get_controlled_accounts: stringify(account?.actor),
});
