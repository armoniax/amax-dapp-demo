import { memo } from "react";
import styles from "./index.module.scss";

declare interface Props {
  visible: boolean;
  children: any;
  onClose: () => void;
}

function Modal({ visible, onClose, children }: Props) {

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.mask} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default memo(Modal);
