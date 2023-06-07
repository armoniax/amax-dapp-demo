import scatter from "../assets/aplink.svg";
import anchor from "../assets/anchor.svg";
export * from "./anchor.config";
export * from "./scatter.config";

export enum WALLET {
  SCATTER = "scatter",
  ANCHOR = "anchor",
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
export const actions: { [key: string]: Action } = {
  transfer: {
    account: "amax.token",
    name: "transfer",
    data: {
      from: "testuser1111",
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
};

export const walletList: WalletListItem[] = [
  {
    title: "Scatter",
    icon: scatter,
    id: WALLET.SCATTER,
  },
  {
    title: "APLink",
    icon: anchor,
    id: WALLET.ANCHOR,
  },
];
