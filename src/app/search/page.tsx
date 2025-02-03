import { Search } from "@/domains/search/Search";
import styles from "./page.module.scss";
import { SearchResults } from "@/domains/search/Results";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Search />
        <SearchResults />
      </main>
    </div>
  );
}
