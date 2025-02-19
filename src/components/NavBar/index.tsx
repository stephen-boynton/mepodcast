import Link from "next/link";
import React from "react";
import styles from "./styles.module.scss";
import { Dropdown } from "../Dropdown";

export const NavBar = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>MePodcast</h1>
      <nav className={styles.nav}>
        <Dropdown />
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
      </nav>
    </div>
  );
};
