import { memo, useState } from "react";
import styles from "./index.module.scss";
import { WALLET, actions } from "@/config";
import { transact } from "@/utils/transact";
import { copy } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "@/store/global";
import { eventBus } from "@bve/eventbus";


function Home() {
  const { account, selectAction, wallet } = useSelector<StoreType, StoreGlobal>((state) => state.global);
  const dispatch = useDispatch();

  const [error, setError] = useState<Error | undefined>(undefined);
  const [transactionId, setTransactionId] = useState('');

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
      eventBus.trigger('login');
      return;
    }
    if (!selectAction) {
      setError(new Error('请选择一个action执行'));
      return;
    };

    try {
      // 可以多个action一起，一般只有一个。
      const transaction = await transact([copy(selectAction)]);
      if (transaction.transaction_id) {   // scatter返回值
        setTransactionId(transaction.transaction_id);
      } else if (transaction?.transaction?.id) {   // anchor返回值
        setTransactionId(transaction.transaction.id.toString());
      }
      console.log(transaction);
      setError(undefined);
    } catch (e: any) {
      if (typeof e === 'string') {
        const { error: { code, details } } = JSON.parse(e);
        setError(new Error(`${code}: ${details[0].message}`));
      } else {
        setError(e);
      }
      throw e;
    }
  }


  return (
    <div className={styles.body}>
      <div className={styles.label}>
        Actions Case:
        {Object.entries(actions).map(([name, action]: [string, Action]) => (
          <div
            key={name}
            className={action.name === selectAction?.name ? styles.active : undefined}
            onClick={() => {
              dispatch(updateState({ selectAction: action }));
            }}
          >
            {name}
          </div>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        onChange={onChange}
        value={JSON.stringify(
          selectAction,
          null,
          4
        )}
      />
      {error && <code className={styles.error}>{JSON.stringify(error.message)}</code>}
      <div className={styles.btnList}>
        <button onClick={onSubmit}>push transaction</button>
        {wallet === WALLET.ANCHOR ? <button onClick={() => {
          window.open(`esr:http`)
        }}>open ESR schema</button> : null}
      </div>
      {transactionId && (
        <div className={styles.success}>
          Success! Transaction signed by{" "}
          <span>{account?.actor}@
            {account?.permission}</span> and bradcast with
          transaction id: <a target="_blank" href={`https://testnet.amaxscan.io/transaction/${transactionId}`}>{transactionId}</a>
        </div>
      )}
    </div>
  );
}

export default memo(Home);
