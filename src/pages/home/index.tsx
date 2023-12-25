import { memo, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { ArmadilloPermission, WALLET, actions, broadcast } from "@/config";
import { transact } from "@/utils/transact";
import { copy } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateArmadilloDate, updateState } from "@/store/global";
import { eventBus } from "@bve/eventbus";
import ArmadilloPanel from "./components/armadilloPanel";
import storage from "@/utils/storage";
import { Client } from "@amax/amaxup"

function Home() {
  const { account, selectAction, wallet } = useSelector<StoreType, StoreGlobal>(
    (state) => state.global
  );
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [transactionId, setTransactionId] = useState("");
  const [signature, setSignature] = useState("");
  const [permission, setPermission] = useState<Permission>(ArmadilloPermission);
  const client = new Client();

  function onChange(e: any) {
    try {
      const action = JSON.parse(e.target.value);
      dispatch(updateState({ selectAction: action }));
    } catch (e: any) {
      setError(e);
    }
  }

  async function onSubmit() {
    if (!account) {
      eventBus.trigger("login");
      return;
    }
    if (!selectAction) {
      setError(new Error("请选择一个action执行"));
      return;
    }

    try {
      // 可以多个action一起，一般只有一个。
      const transaction = await transact(
        Array.isArray(selectAction) ? copy(selectAction) : [copy(selectAction)]
      );
      if (transaction.transaction_id) {
        // scatter返回值
        setTransactionId(transaction.transaction_id);
      } else if (transaction?.transaction?.id) {
        // anchor返回值
        setTransactionId(transaction.transaction.id.toString());
      }
      setError(undefined);
    } catch (e: any) {
      if (typeof e === "string") {
        const {
          error: { code, details },
        } = JSON.parse(e);
        setError(new Error(`${code}: ${details[0].message}`));
      } else {
        setError(e);
      }
      throw e;
    }
  }

  function changePermission(e: any) {
    const value = e.target.value;
    const account = storage.get("account", {});
    account.permission = value;
    storage.set("account", account);
    setPermission(value);
  }

  useEffect(() => {
    const account = storage.get("account");
    if (account) {
      setPermission(account.permission);
    }
  }, []);

  async function signMessage() {
    const msg = await window.armadillo.signMessage(
      "这里是签名内容！" + new Date()
    );
    setSignature(msg);
  }

  // 必须要在AMAXUP中访问才可以用@amax/amaxup钱包
  async function amaxupSignMessage() {
    if (client.isInIframe()) {
      const msg = await client.signMessage(
        "这里是签名内容！" + new Date()
      );
      setSignature(msg);
    }
  }



  async function testTransact() {
    const transaction = await window.armadillo.transact({
      transaction: {
        actions: [
          {
            account: "amax.token",
            name: "transfer",
            data: {
              from: "frank12345oo",
              to: "aplyzgnh3spi",
              quantity: "0.00010000 AMAX",
              memo: "123123",
            },
            authorization: [{ actor: "frank12345oo", permission: "active" }],
          },
          {
            account: "amax.token",
            name: "transfer",
            data: {
              from: "frank12345oo",
              to: "aplyzgnh3spi",
              quantity: "0.00020000 AMAX",
              memo: "123123",
            },
            authorization: [{ actor: "frank12345oo", permission: "active" }],
          },
        ],
      }
    });
    setTransactionId(transaction.transaction_id);
    console.log('testTransact', transaction);
  }

  async function getNetwork() {
    const network = await window.armadillo.getNetwork();

    dispatch(updateArmadilloDate({ network }));
  }


  return (
    <div className={styles.body}>
      <div className={styles.label}>
        Actions Case:
        {Object.entries(actions).map(([name, action], i) => (
          <div
            key={name}
            className={i === index ? styles.active : undefined}
            onClick={() => {
              dispatch(updateState({ selectAction: action }));
              setIndex(i);
            }}
          >
            {name}
          </div>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        onChange={onChange}
        value={JSON.stringify(selectAction, null, 4)}
      />

      {error && (
        <code className={styles.error}>{JSON.stringify(error.message)}</code>
      )}
      <div className={styles.btnList}>
        <button onClick={onSubmit}>push transaction</button>
        <label>
          <input
            type="checkbox"
            defaultChecked={storage.get("broadcast", broadcast)}
            onChange={(e) => {
              storage.set("broadcast", e.target.checked);
            }}
          />
          是否广播
        </label>
        {wallet === WALLET.ARMADILLO ? (
          <>
            <div>
              权限(Permission):
              <label>
                <input
                  name="permission"
                  type="radio"
                  value="active"
                  checked={permission === "active"}
                  onChange={changePermission}
                />
                active
              </label>
              <label>
                <input
                  name="permission"
                  type="radio"
                  value="owner"
                  checked={permission === "owner"}
                  onChange={changePermission}
                />
                owner
              </label>
            </div>
            <button onClick={signMessage}>signMessage</button>
            <button onClick={getNetwork}>getNetwork</button>
          </>
        ) : null}
        {
          client.isInIframe() ? <button onClick={amaxupSignMessage}>amaxup signMessage</button> : null
        }
        {wallet === WALLET.ANCHOR ? (
          <button
            onClick={() => {
              window.open(`esr:http`);
            }}
          >
            open ESR schema
          </button>
        ) : null}
        <button onClick={testTransact}>transact</button>
      </div>
      {transactionId && (
        <div className={styles.success}>
          Success! Transaction signed by{" "}
          <span>
            {account?.actor}@{account?.permission}
          </span>{" "}
          and bradcast with transaction id:{" "}
          <a
            target="_blank"
            href={`https://testnet.amaxscan.io/transaction/${transactionId}`}
            rel="noreferrer"
          >
            {transactionId}
          </a>
        </div>
      )}

      {signature && <div className={styles.success}>{signature}</div>}

      {wallet === WALLET.ARMADILLO ? <ArmadilloPanel /> : null}
    </div>
  );
}

export default memo(Home);
