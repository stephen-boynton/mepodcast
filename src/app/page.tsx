import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>Subscribe to podcasts to populate your feed.</p>
      </main>
    </div>
  );
}
