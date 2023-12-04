import { memo, useEffect, useState } from "react";
import { JSONTree } from "react-json-tree";
import styles from "./index.module.scss";
import { getRPC } from "@/utils/armadillo";
import { JsonRpc } from "@amax/amaxjs-v2";
import { getRPCParams } from "@/config";
import { useSelector } from "react-redux";
import { Client } from "@amax/amaxup"

function RPC() {
  const { account, wallet } = useSelector<StoreType, StoreGlobal>(
    (state) => state.global
  );
  const [params, setParams] = useState<any>();
  const [response, setResponse] = useState<any>();
  const [key, setKey] = useState('');
  const list = Object.keys(JsonRpc.prototype);
  const rpcParams = getRPCParams(account);


  function onChange(e: any) {
    try {
      const params = e.target.value;
      setParams(params);
    } catch (e: any) {
      console.error(e);
    }
  }

  async function onSubmit() {
    try {
      // 透传，用armadillo钱包节点请求
      if (wallet === 'armadillo') {
        // 第一种方案
        // const data = await window.armadillo.request({
        //   method: 'rpc',  // 表明是rpc请求
        //   params: {
        //     request: {
        //       method: key, // 具体请求接口(JsonRpc上的方法)
        //       params: JSON.parse(params), // 请求参数，相当于`arguments`
        //     },
        //   }
        // });

        //  第二种方案
        const data = await window.armadillo.rpc[key](...JSON.parse(params))
        setResponse(data);

        // 透传，用AMAXUP web所选择的钱包节点请求
      } else if (wallet === 'amaxup') {
        const client = new Client();
        // @ts-ignore
        const data = await client.rpc[key](...JSON.parse(params))

        setResponse(data);
      } else {
        // 本地节点来请求
        const rpc = getRPC();
        // @ts-ignore
        const data = await rpc[key](...JSON.parse(params));
        setResponse(data);
      }
    } catch (e: any) {
      setResponse({ error: e });
    }
  }

  return (
    <div className={styles.body}>
      <textarea
        className={styles.textarea}
        onChange={onChange}
        value={params}
      />

      {account ? <><ul className={styles.list}>
        {list.map((item) => (
          <li className={item === key ? styles.hover : ''} onClick={() => {
            setKey(item);
            setParams(rpcParams[item] || `[""]`);
          }}>
            {item}
          </li>
        ))}
      </ul>
        <div className={styles.btnList}>
          <button onClick={onSubmit}>RUN</button>
        </div></>
        : <div>请链接钱包</div>}

      {response ? (
        <JSONTree
          data={response || {}}
          theme={{ base00: "#FFF" }}
          invertTheme={false}
        />
      ) : null}
    </div>
  );
}

export default memo(RPC);
