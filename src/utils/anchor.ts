import AnchorLink, {
  APIError,
  ChainId,
  LinkChannelSession,
  LinkSession,
} from "@amax/anchor-link";
import { network, scope } from "../config";
import { IdentityProof } from "eosio-signing-request";
import AnchorLinkBrowserTransport from "@amax/anchor-link-browser-transport";
import { eventBus } from "@bve/eventbus";

export async function verifyProof(link: any, identity: any) {
  // Generate an array of valid chain IDs from the demo configuration
  const chains = [network.chainId]; // blockchains.map((chain) => chain.chainId);

  // Create a proof helper based on the identity results from anchor-link
  const proof = IdentityProof.from(identity.proof);

  // Check to see if the chainId from the proof is valid for this demo

  const chain = chains.find((id) =>
    ChainId.from(id).equals(proof.chainId as any)
  );
  if (!chain) {
    throw new Error("Unsupported chain supplied in identity proof");
  }

  // Load the account data from a blockchain API
  let account;
  try {
    account = await link.client.v1.chain.get_account(proof.signer.actor);
  } catch (error) {
    if (error instanceof APIError && error.code === 0) {
      throw new Error("No such account");
    } else {
      throw error;
    }
  }

  // Retrieve the auth from the permission specified in the proof
  const auth = account.getPermission(proof.signer.permission).required_auth;

  // Determine if the auth is valid with the given proof
  const valid = proof.verify(auth, account.head_block_time);

  // If not valid, throw error
  if (!valid) {
    throw new Error("Proof invalid or expired");
  }

  // Recover the key from this proof
  const proofKey = proof.recover();

  // Return the values expected by this demo application
  return {
    account,
    proof,
    proofKey,
    proofValid: valid,
  };
}

export function getLink(): AnchorLink {
  // 缓存实例
  if (!window.__LINK__) {
    const transport = new AnchorLinkBrowserTransport({
      currentLocale: "zh-cn",
    });

    const link = new AnchorLink({
      transport,
      service: "https://fwd.aplink.app",
      chains: [
        {
          chainId: network.chainId,
          nodeUrl: `${network.protocol}://${network.host}`,
        },
      ],
    });

    link.restoreSession(scope);

    window.__LINK__ = link;
  }
  onAppRemoveSession();
  return window.__LINK__;
}

/**
 * 监听 APLink 退出登录
 * @returns
 */
export async function onAppRemoveSession() {
  if (!window.__LINK__) {
    return;
  }
  const session: LinkSession = await window.__LINK__.restoreSession(scope);
  if (session) {
    (session as LinkChannelSession).onAppRemoveSession(() => {
      eventBus.trigger("logout");
    });
  }
}

export async function login(): Promise<PermissionLevel> {
  const link = getLink();
  const identity = await link.login(scope);
  try {
    const { proof } = await verifyProof(link, identity);
    await onAppRemoveSession();
    const actor = proof.signer.actor.toString();
    const permission = proof.signer.permission.toString();
    return {
      actor,
      permission,
    };
  } catch (e) {
    await link.clearSessions(scope);
    throw e;
  }
}
