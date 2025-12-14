import Link from "next/link";
import styles from "../page.module.css";
import CryingBeaverGame from "../components/CryingBeaverGame";

export default function SadPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h2>Üzgün Kunduz Oyunu</h2>
        <CryingBeaverGame />
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/login">
            <button className={styles.guestButton}>Geri dön</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
