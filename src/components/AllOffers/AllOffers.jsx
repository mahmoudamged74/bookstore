import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AllOffers.module.css";

function AllOffers() {
  // بيانات العروض والخصومات
  const offers = useMemo(() => ([
    {
      id: "valorant-offer-1",
      title: "VALORANT",
      image: "/valo.png",
      desc: "خصم 50% على جميع حزم VALORANT! احصل على نقاط VP بأسعار مذهلة.",
      originalPrice: 19.99,
      discountPrice: 9.99,
      discount: 50,
      badge: "خصم 50%",
      isHot: true,
    },
    {
      id: "fc25-offer",
      title: "FC25",
      image: "/fifa.png",
      desc: "عرض خاص على EA FC25! احصل على اللعبة مع حزمة الميزات الكاملة.",
      originalPrice: 29.99,
      discountPrice: 19.99,
      discount: 33,
      badge: "عرض خاص",
      isHot: false,
    },
    {
      id: "pubg-offer",
      title: "PUBG MOBILE",
      image: "/pubg.png",
      desc: "خصم 40% على جميع حزم PUBG MOBILE! أسلحة ومركبات حصرية.",
      originalPrice: 24.99,
      discountPrice: 14.99,
      discount: 40,
      badge: "خصم 40%",
      isHot: true,
    },
    {
      id: "valorant-offer-2",
      title: "VALORANT",
      image: "/valo.png",
      desc: "حزمة العميل الجديد! احصل على 3 عملاء مجاناً مع نقاط VP.",
      originalPrice: 15.99,
      discountPrice: 7.99,
      discount: 50,
      badge: "عرض جديد",
      isHot: false,
    },
    {
      id: "cs2-offer",
      title: "CS2",
      image: "/valo.png",
      desc: "خصم 30% على جميع حزم CS2! أسلحة وسكيز حصرية.",
      originalPrice: 22.99,
      discountPrice: 15.99,
      discount: 30,
      badge: "خصم 30%",
      isHot: false,
    },
    {
      id: "bundle-offer",
      title: "حزمة الألعاب",
      image: "/valo.png",
      desc: "حزمة شاملة من أفضل الألعاب! احصل على 5 ألعاب بسعر واحد.",
      originalPrice: 99.99,
      discountPrice: 49.99,
      discount: 50,
      badge: "حزمة شاملة",
      isHot: true,
    },
  ]), []);

  // عدد العناصر في كل صفحة
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // حساب الصفحات
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

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
      <div className={styles.headerRow}>
        <div className={styles.headings}>
          <h2 className={styles.title}>العروض والخصومات</h2>
          <p className={styles.subtitle}>احصل على أفضل العروض والخصومات الحصرية</p>
        </div>
      </div>

      <div className={styles.grid}>
        {currentOffers.map((offer) => (
          <Link key={offer.id} to="/book-details" className={`${styles.card} floating-element`}>
            <div className={styles.thumbWrap}>
              <img src={offer.image} alt={offer.title} className={styles.thumb} />
              {offer.isHot && <div className={styles.hotBadge}>🔥</div>}
              <div className={styles.discountBadge}>{offer.badge}</div>
            </div>

            <div className={styles.body}>
              <h3 className={styles.gameTitle}>{offer.title}</h3>
              <p className={styles.desc}>{offer.desc}</p>
              
              <div className={styles.priceSection}>
                <div className={styles.priceRow}>
                  <span className={styles.originalPrice}>${offer.originalPrice.toFixed(2)}</span>
                  <span className={styles.discountPrice}>${offer.discountPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className={styles.btnPrimary}>احصل على العرض</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {totalPages === 1 && (
          <>
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
          </>
        )}
        
      </div>
    </section>
  );
}

export default AllOffers;
