import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./GameStoreWithPagination.module.css";

function GameStoreWithPagination() {
  // بيانات تجريبية — غيّر الصور/الأسعار حسب مشروعك
  const games = useMemo(() => ([
    {
      id: "valorant-1",
      title: "VALORANT",
      image: "/valo.png",
      desc:
        "لعبة Valorant من أشهر الألعاب في عالم القتالات والتكتيك. استمتع بلعب سريع وانضم لفريقك لتكون الأفضل دائمًا.",
      price: 9.99,
    },
    {
      id: "fc25",
      title: "FC25",
      image: "/fifa.png",
      desc:
        "لعبة EA FC25 من الرياضات الإلكترونية. ابنِ تشكيلتك المفضلة ونافس أصدقائك واللاعبين من حول العالم.",
      price: 9.99,
    },
    {
      id: "pubg",
      title: "PUBG MOBILE",
      image: "/pubg.png",
      desc:
        "كن آخر من يبقى على قيد الحياة! مغامرات ومعارك ملكية مشوّقة مع أسلحة ومركبات متنوعة.",
      price: 9.99,
    },
    {
      id: "valorant-2",
      title: "VALORANT",
      image: "/valo.png",
      desc:
        "أسلحة فريدة وقدرات خاصة لكل عميل تجعل كل جولة مختلفة. هل أنت جاهز للتحدي؟",
      price: 9.99,
    },
    {
        id: "pubg",
        title: "PUBG MOBILE",
        image: "/pubg.png",
        desc:
          "كن آخر من يبقى على قيد الحياة! مغامرات ومعارك ملكية مشوّقة مع أسلحة ومركبات متنوعة.",
        price: 9.99,
      },
      {
        id: "pubg",
        title: "PUBG MOBILE",
        image: "/pubg.png",
        desc:
          "كن آخر من يبقى على قيد الحياة! مغامرات ومعارك ملكية مشوّقة مع أسلحة ومركبات متنوعة.",
        price: 9.99,
      },
      {
        id: "pubg",
        title: "PUBG MOBILE",
        image: "/pubg.png",
        desc:
          "كن آخر من يبقى على قيد الحياة! مغامرات ومعارك ملكية مشوّقة مع أسلحة ومركبات متنوعة.",
        price: 9.99,
      },
      {
        id: "pubg",
        title: "PUBG MOBILE",
        image: "/pubg.png",
        desc:
          "كن آخر من يبقى على قيد الحياة! مغامرات ومعارك ملكية مشوّقة مع أسلحة ومركبات متنوعة.",
        price: 9.99,
      },
    {
      id: "cs2",
      title: "CS2",
      image: "/cs2.png",
      desc:
        "لعبة الرماية التكتيكية الأكثر تنافسية. مهارة ودقة في كل طلقة.",
      price: 9.99,
    },
  ]), []);

  // عدد العناصر في كل صفحة
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // حساب الصفحات
  const totalPages = Math.ceil(games.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  // تغيير الصفحة
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إنشاء أرقام الصفحات
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.pageBtn} ${currentPage === i ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <section className={styles.section} dir="rtl">
      <div className={styles.grid}>
        {currentGames.map((g) => (
          <Link key={g.id} to="/book-details" className={styles.card}>
            <div className={styles.thumbWrap}>
              <img src={g.image} alt={g.title} className={styles.thumb} />
            </div>

            <div className={styles.body}>
              <h3 className={styles.gameTitle}>{g.title}</h3>
              <p className={styles.desc}>{g.desc}</p>
              <p className={styles.priceLine}>
                أسعار تبدأ من <strong>${g.price.toFixed(2)}</strong>
              </p>
              <div className={styles.btnPrimary}>عرض</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹ السابق
          </button>

          {renderPageNumbers()}

          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            التالي ›
          </button>
        </div>
      )}

   
    </section>
  );
}

export default GameStoreWithPagination;
