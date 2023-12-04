import { memo } from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";


function ArmadilloPanel() {
  const { armadilloDate } = useSelector<StoreType, StoreGlobal>((state) => state.global);

  return (
    <div className={styles.body}>
      <div>Armadillo Listener</div>
      <pre>
        {JSON.stringify(armadilloDate, null, 4)}
      </pre>
    </div>
  );
}

export default memo(ArmadilloPanel);
