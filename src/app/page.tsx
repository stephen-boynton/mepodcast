import styles from "./page.module.scss";
import { Home } from "@/modules/home";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Home />
    </div>
  );
}
