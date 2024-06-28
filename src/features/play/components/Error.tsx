import Link from "next/link";
import styles from "./Error.module.css";

export default function Error({ error }: { error: string }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>{error}</div>
      <Link href="/" className={styles.returnLink}>ホームへ戻る</Link>
    </div>
  );
}
