import Amax from "@amax/amaxjs";
import { broadcast, network, options } from "../config";

/**
 * 获取 scatter 钱包对像
 * @returns
 */
export function getScatter() {
  if (!window.scatter) {
    throw new Error("请在APLink钱包在访问");
  }
  return window.scatter;
}

/**
 * 获取用户信息
 * @returns
 */
export async function getAccount(): Promise<PermissionLevel> {
  const scatter = getScatter();
  const { accounts } = await scatter.getIdentity({
    accounts: [{ chainId: network.chainId, blockchain: network.blockchain }],
  });
  if (!accounts?.length) {
    throw new Error("用户不存在");
  }
  const { name, authority } = accounts[0];
  return { permission: authority, actor: name };
}

/**
 * 获取amaxjs实例，可进行合约操作。
 * @returns
 */
export async function getClient() {
  const scatter = getScatter();
  // scatterAMAX缓存对像，防止不必要的创建实例
  if (!window.scatterAMAX) {
    const account = await getAccount();
    window.scatterAMAX = scatter.amax(
      network,
      Amax,
      {
        ...options,
        // 为了兼容老版本APLink
        broadcast:
          broadcast || !(window.tinyBrige && window.tinyBrige.pushTransaction),
        authorization: [`${account.actor}@${account.permission}`],
      },
      network.protocol
    );
  }
  return window.scatterAMAX;
}

/**
 * 与getClient不同，这个只能用于查询数据，不能用于合约操作。
 * @returns
 */
export function getLocalClient() {
  const client = Amax({
    httpEndpoint: `${network.protocol}://${network.host}`,
    chainId: network.chainId,
  });
  return client;
}
