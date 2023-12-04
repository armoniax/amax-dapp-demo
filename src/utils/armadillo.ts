import { Api, JsonRpc, RpcError } from "@amax/amaxjs-v2";
import { JsSignatureProvider } from "@amax/amaxjs-v2/dist/eosjs-jssig";
import { ArmadilloPermission, broadcast, network, options } from "../config";
import storage from "./storage";

/**
 * 获取用户信息
 * @returns
 */
export async function getAccount(): Promise<PermissionLevel | undefined> {
  try {
    const accounts = await window.armadillo.requestAccounts();
    const account = storage.get("account");
    if (accounts.length) {
      return {
        actor: accounts[0].account,
        permission: account ? account.permission : ArmadilloPermission,
        publicKey: accounts[0].publicKey,
      };
    } else {
      throw new Error("not account");
    }
  } catch (e) {
    console.error(e);
  }
}

export function getRPC(): JsonRpc {
  return new JsonRpc(`${network.protocol}://${network.host}`, { fetch });
}

/**
 * 获取client
 * @returns
 */
export async function getClient(): Promise<{
  api: Api;
  rpc: JsonRpc;
}> {
  const signatureProvider = new JsSignatureProvider([]);
  const rpc = getRPC();
  const api = await window.armadillo.getApi(Api, { rpc, signatureProvider });
  return { api, rpc };
}
