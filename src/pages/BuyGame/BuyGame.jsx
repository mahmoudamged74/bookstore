import React, { useMemo, useState } from "react";
import styles from "./BuyGame.module.css";

function BuyGame() {
  // بيانات تجريبية للباكدجات
  const packs = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: "60 UC",
        discount: 5.0,
        price: 0.99,
      })),
    []
  );

  const [selected, setSelected] = useState(null);

  const handleBuy = () => {
    if (!selected) return;
    // TODO: نفّذ منطق الشراء، فتح مودال، أو الانتقال لصفحة الدفع
    alert(`تم اختيار الباقة رقم ${selected.id} — ${selected.name} بسعر $${selected.price.toFixed(2)}`);
  };

  return (
    <section className={styles.wrap} dir="rtl">


      {/* سكشن الكاردات */}
      <div className={styles.rightCol}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            اشحن في لعبة <span className={styles.gameName}>FC 2020</span> الان
          </h3>
          <p className={styles.subtitle}>
            لعبة<strong>FC 2025</strong>من اشهر العاب كرة القدم في العالم
          </p>
        </header>
              {/* صورة اللعبة متوسطة */}
      <aside className={styles.leftCard}>
        <img src="/fifa.png" alt="FC25" />
      </aside>

        {/* الشبكة */}
        <div className={styles.grid}>
          {packs.map((p) => {
            const isSelected = selected?.id === p.id;
            return (
              <button
                key={p.id}
                className={`${styles.pack} ${isSelected ? styles.selected : ""}`}
                onClick={() => setSelected(p)}
              >
                <span className={styles.badge}>%{p.discount.toFixed(1)} خصم</span>
                <span className={styles.amount}>{p.name}</span>
                <span className={styles.price}>US$ {p.price.toFixed(2)}</span>

                {/* علامة التحديد */}
                <span className={styles.radio} aria-hidden="true">
                  <span className={styles.dot} />
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <button
            className={styles.buyBtn}
            disabled={!selected}
            onClick={handleBuy}
          >
            اشحن الآن
          </button>
        </div>
      </div>
    </section>
  );
}

export default BuyGame;
