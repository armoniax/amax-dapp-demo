import { AnyAction } from "@amax/anchor-link";
import { Action as ActionType } from "@amax/amaxjs-v2/dist/eosjs-serialize";
import { WALLET, broadcast, scope } from "../config";
import { getLink } from "./anchor";
import { getClient } from "./scatter";
import { getClient as getArmadilloClient } from "./armadillo";
import storage from "./storage";
import { getAmaxupClient } from "./amaxup";

/**
 * 调用合约入口
 */
export async function transact(actions: Action[]) {
  if (!Array.isArray(actions) || !actions.length) {
    return;
  }

  // 给action加上authorization
  actions = addAuthorization(actions.filter((item) => checkAction(item)));

  const wallet = storage.get("wallet");

  try {
    if (wallet === WALLET.ANCHOR) {
      return await anchor(actions);
    } else if (wallet === WALLET.SCATTER) {
      return await scatter(actions);
    } else if (wallet === WALLET.ARMADILLO) {
      return await armadillo(actions);
    } else if (wallet === WALLET.AMAXUP) {
      return await amaxup(actions);
    }
  } catch (e) {
    const error: any = typeof e === "string" ? JSON.parse(e) : e;
    if (error?.error) {
      const { code, details = [] } = error.error;
      console.error(`${code}: ${details[0].message}`);
    }
    throw e;
  }
}

function checkAction(action: Action) {
  const { account, data, name } = action;
  if (!account || !data || !name) {
    return false;
  }
  return true;
}

/**
 * 如果action没有authorization，就给action增加authorization属性
 * @param actions
 * @returns
 */
function addAuthorization(actions: Action[]): Action[] {
  const account = storage.get("account");
  for (const action of actions) {
    if (!action.authorization || action.authorization.length === 0) {
      action.authorization = [
        { actor: account.actor, permission: account.permission },
      ];
    }
  }
  return actions;
}

/**
 * Scatter发起交易
 * @param actions
 * @returns
 */
async function scatter(actions: Action[]) {
  const client = await getClient();
  return await client.transaction({ actions });
}

/**
 * Anchor发起交易
 * @param actions
 * @returns
 */
async function anchor(actions: Action[]) {
  const link = getLink();
  const session = await link.restoreSession(scope);

  return await session?.transact(
    { actions: actions as AnyAction[] },
    { broadcast: storage.get("broadcast", broadcast) }
  );
}

/**
 * APLink发起交易
 * @param actions
 * @returns
 */
async function armadillo(actions: Action[]) {
  const { api } = await getArmadilloClient();
  console.log("actions", actions);
  return await api.transact(
    { actions: actions as ActionType[] },
    {
      blocksBehind: 3,
      expireSeconds: 30,
      broadcast: storage.get("broadcast", broadcast),
    }
  );
}

async function amaxup(actions: Action[]) {
  console.log("actions", actions);
  const client = await getAmaxupClient();
  return await client.transact(actions);
}
