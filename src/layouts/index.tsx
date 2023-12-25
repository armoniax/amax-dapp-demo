import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from "./index.module.scss";
import Header from './components/header';

export default function Layouts() {
  return (
    <>
      <Header />
      <div className={styles.content}><Outlet /></div>
      <div className={styles.footer}>
        <a target='_blank' href="https://showdoc.amax.network/web/#/35/189" rel="noreferrer">
          Armadillo 开发文档
        </a>
        <a target='_blank' href="https://showdoc.amax.network/web/#/35/184" rel="noreferrer">
          APLink 开发文档
        </a>
        <a target='_blank' href="https://chromewebstore.google.com/detail/armadillo/ahkbnfljhaifiikpkhnkeobchonbpjpb?hl=zh-CN&utm_source=ext_sidebar" rel="noreferrer">
          Armadillo 安装
        </a>
        <a target='_blank' href="https://toolbox.amaxtest.com/main" rel="noreferrer">
          AMAX 合约调试工具
        </a>
      </div >
    </>
  );
}
