import { memo, useState } from "react";
import { JSONTree } from 'react-json-tree';
import styles from "./index.module.scss";
import { getLocalClient } from "@/utils/scatter";

function Search() {
  const [params, setParams] = useState<GetTableRowsParams>({
    "code": "amax.ntoken",
    "scope": "amax.ntoken",
    "table": "tokenstats",
    "json": true,
    "limit": 1000000,
    "reverse": false,
    "index_position": 1,
    "encode_type": "i128",
    "key_type": "i128",
    "upper_bound": "",
    "lower_bound": "",
    "show_payer": false
  });
  const [response, setResponse] = useState();

  function onChange(e: any) {
    try {
      const params = JSON.parse(e.target.value);
      setParams(params);
    } catch (e: any) {
      console.error(e);
    }
  }

  async function onSubmit() {
    const client = getLocalClient();
    const { rows } = await client.getTableRows(params);
    setResponse(rows);
  }

  return (
    <div className={styles.body}>
      <textarea
        className={styles.textarea}
        onChange={onChange}
        value={JSON.stringify(
          params,
          null,
          4
        )}
      />
      <div className={styles.btnList}>
        <button onClick={onSubmit}>Search</button>
      </div>
      {response ? <JSONTree
        data={response || {}}
        theme={{ base00: '#FFF' }}
        invertTheme={false}
      /> : null}
    </div>
  );
}

export default memo(Search);
