import { Fragment, memo, useEffect, useState } from "react";
import AnchorLink from "@amax/anchor-link";
import { useSelector, useDispatch } from 'react-redux'
import { eventBus } from "@bve/eventbus";
import Modal from "@/components/modal";
import styles from "./index.module.scss";
import { WALLET, scope, walletList } from "@/config";
import { login as anchorLogin, getLink } from "@/utils/anchor";
import { getScatter, getAccount as scatterLogin } from "@/utils/scatter";
import storage from "@/utils/storage";
import { Link } from "react-router-dom";
import { updateState } from "@/store/global";



function Header() {
  const { account } = useSelector<StoreType, StoreGlobal>((state) => state.global);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);


  async function selectWallet(id: string) {
    let account;
    if (id === WALLET.ANCHOR) {
      account = await anchorLogin();
    } else if (id === WALLET.SCATTER) {
      account = await scatterLogin();
    }
    storage.set('wallet', id);
    storage.set('account', account);
    dispatch(updateState({ account, wallet: id }));
    setVisible(false);
  }

  useEffect(() => {
    const wallet = storage.get("wallet", undefined);
    /**
     * 刷新页面后，重新获取登录帐户
     */
    if (wallet) {
      if (wallet === WALLET.SCATTER) {
        /**
         * scatter插件加载完成会触发scatterLoaded
         */
        document.addEventListener('scatterLoaded', () => {
          selectWallet(wallet);
        });
      } else if (wallet === WALLET.ANCHOR) {
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
      }
    }

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

  function logout() {
    const wallet = storage.get('wallet');
    if (wallet === WALLET.SCATTER) {
      const scatter = getScatter();
      scatter.forgetIdentity();
    } else if (wallet === WALLET.ANCHOR) {
      const link = getLink();
      link.clearSessions(scope);
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
        <div><Link to='/'>Home</Link><Link to='/search'>Search</Link></div>
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
