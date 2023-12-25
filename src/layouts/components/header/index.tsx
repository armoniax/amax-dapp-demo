import { Fragment, memo, useCallback, useEffect, useState } from "react";
import AnchorLink from "@amax/anchor-link";
import { useSelector, useDispatch } from 'react-redux'
import { eventBus } from "@bve/eventbus";
import Modal from "@/components/modal";
import styles from "./index.module.scss";
import { ArmadilloPermission, WALLET, scope, walletList } from "@/config";
import { login as anchorLogin, getLink } from "@/utils/anchor";
import { getAccount as armadilloLogin } from "@/utils/armadillo";
import storage from "@/utils/storage";
import { Link } from "react-router-dom";
import { updateState, updateArmadilloDate } from "@/store/global";
import { getAmaxupClient } from "@/utils/amaxup";
import { Account, ServerEventType } from "@amax/amaxup";



function Header() {
  const { account, wallet } = useSelector<StoreType, StoreGlobal>((state) => state.global);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  async function selectWallet(id: string) {
    try {
      let account;
      if (id === WALLET.ANCHOR) {
        account = await anchorLogin();
      } else if (id === WALLET.ARMADILLO) {
        account = await armadilloLogin()
      }
      if (account) {
        storage.set('wallet', id);
        storage.set('account', account);
        dispatch(updateState({ account, wallet: id }));
      }
      setVisible(false);
    } catch (e) {
      throw e
    } finally {

    }
  }


  useEffect(() => {
    const wallet = storage.get("wallet", undefined);
    /**
     * 刷新页面后，重新获取登录帐户
     */
    if (wallet) {
      if (wallet === WALLET.ANCHOR) {
        const link: AnchorLink = getLink();
        link.restoreSession(scope).then(async (session) => {
          if (session) {
            const { actor, permission } = session.auth;
            dispatch(updateState({
              account: {
                actor: actor.toString(),
                permission: permission.toString(),
              }
            }));
          }
        });
      } else if (wallet === WALLET.ARMADILLO) {
        document.addEventListener('armoniaxLoaded', () => {
          selectWallet(WALLET.ARMADILLO);
        });
      }
    }
    const client = getAmaxupClient();
    client.on(ServerEventType.ACCOUNTS_CHANGED, (accounts: Account[]) => {
      console.log('accounts', accounts);
      if (accounts.length) {
        const account = accounts[0]
        storage.set('wallet', WALLET.AMAXUP);
        storage.set('account', {
          actor: account.name,
          permission: account.permission,
        });
        dispatch(updateState({
          account: {
            actor: account.name,
            permission: account.permission,
          },
          wallet: WALLET.AMAXUP
        }));
      }
    })

    eventBus.on('login', () => {
      setVisible(true);
    });
    /**
     * 绑定退出登录
     * APLink端退出时触发。
     */
    eventBus.on('logout', logout);
    return () => {
      eventBus.off('logout');
      eventBus.off('login');
    }
  }, [])

  useEffect(() => {
    if (wallet === WALLET.ARMADILLO) {
      window.armadillo.on('networkChanged', (network: any) => {
        dispatch(updateArmadilloDate({ network }))
      })
      window.armadillo.on('accountsChanged', (accounts: any) => {
        dispatch(updateArmadilloDate({ accounts }))
        const account = storage.get('account');
        if (accounts.length) {
          const _account = {
            actor: accounts[0].account,
            permission: account ? account.permission : ArmadilloPermission,
          }
          dispatch(updateState({
            account: _account
          }));
          storage.set('account', _account);
        } else {
          console.error('帐号未激活');
        }
      })
    }
  }, [wallet])

  function logout() {
    const wallet = storage.get('wallet');
    if (wallet === WALLET.ANCHOR) {
      const link = getLink();
      link.clearSessions(scope);
    } else if (wallet === WALLET.ARMADILLO) {
      window.armadillo.removeListener('networkChanged');
      window.armadillo.removeListener('accountsChanged');
    }
    storage.remove('wallet');
    storage.remove('account');
    dispatch(updateState({ account: undefined, wallet: undefined }));

  }



  return (
    <Fragment>
      <header className={styles.header}>
        {account ? (
          <div>
            user: {account.actor}@{account.permission}
          </div>
        ) : (
          <div>AMAX</div>
        )}
        <div><Link to='/'>Home</Link><Link to='/rpc'>RPC</Link></div>
        <div>
          {account ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button
              onClick={() => {
                setVisible(true);
              }}
            >
              Connect wallet
            </button>
          )}
        </div>
      </header>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        {walletList.map(({ icon, title, id }) => (
          <div
            key={id}
            className={styles.wallet}
            onClick={() => {
              selectWallet(id);
            }}>
            <img src={icon} width={24} alt="" />
            {title}
          </div>
        ))}
      </Modal>
    </Fragment>
  );
}

export default memo(Header);
