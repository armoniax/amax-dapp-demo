import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from "./index.module.scss";
import Header from './components/header';

export default function Layouts() {
  return (
    <>
      <Header />
      <div className={styles.content}><Outlet /></div>
    </>
  );
}
