import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../utils/notifications";
import { useCart } from "../../context/CartContext";
import styles from "./AllOffers.module.css";

function AllOffers() {
  const { t, i18n, ready } = useTranslation("global");
  const [offersData, setOffersData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const { addToCart, updateCartItem, cartItems } = useCart();

  // تحديث تاتيل الصفحة
  useEffect(() => {
    document.title =
      i18n.language === "ar" ? "العروض والخصومات" : "Offers & Discounts";
  }, [i18n.language]);

  // تحديث العدادات من الكارت الفعلي
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const cartQuantities = {};
      cartItems.forEach((item) => {
        cartQuantities[item.product.id] = parseInt(item.qty);
      });
      setQuantities(cartQuantities);
    }
  }, [cartItems]);

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  // جلب بيانات العروض من API
  useEffect(() => {
    fetchOffersData();
  }, [i18n.language, currentPage]);

  const fetchOffersData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/home/offers-books-section?page=${currentPage}`,
        {
          headers: {
            lang: i18n.language || "en",
          },
        }
      );

      if (response.data?.status && response.data?.data) {
        setOffersData(response.data.data.books_data || []);
        setPagination(response.data.data.pagination || null);
      } else {
        setOffersData([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching offers data:", error);
      setOffersData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // دوال العداد
  const handleQuantityChange = async (offerId, change) => {
    // تحقق من تسجيل الدخول
    const token = localStorage.getItem("token");
    if (!token) {
      showWarning(
        "تسجيل الدخول مطلوب",
        "يجب عليك تسجيل الدخول أولاً لإضافة الكتب إلى السلة"
      );
      return;
    }

    const currentQuantity = quantities[offerId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    // تحديث العداد المحلي أولاً
    setQuantities((prev) => ({
      ...prev,
      [offerId]: newQuantity,
    }));

    // إضافة للكارت إذا كان التغيير موجب
    if (change > 0) {
      await addToCart(offerId, 1);
    } else if (change < 0 && newQuantity > 0) {
      // البحث عن المنتج في الكارت وتحديث كميته
      const cartItem = cartItems.find((item) => item.product.id === offerId);
      if (cartItem) {
        await updateCartItem(cartItem.id, newQuantity);
      }
    }
  };

  // دالة تغيير الصفحة
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // دالة إنشاء أزرار الصفحات
  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const buttons = [];
    const { current_page, last_page } = pagination;

    // زر الصفحة الأولى
    if (current_page > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className={styles.pageBtn}
        >
          {i18n.language === "ar" ? "الأولى" : "First"}
        </button>
      );
    }

    // زر الصفحة السابقة
    if (current_page > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(current_page - 1)}
          className={styles.pageBtn}
        >
          {i18n.language === "ar" ? "السابقة" : "Previous"}
        </button>
      );
    }

    // أزرار الصفحات
    const startPage = Math.max(1, current_page - 2);
    const endPage = Math.min(last_page, current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageBtn} ${
            i === current_page ? styles.activePage : ""
          }`}
        >
          {i}
        </button>
      );
    }

    // زر الصفحة التالية
    if (current_page < last_page) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(current_page + 1)}
          className={styles.pageBtn}
        >
          {i18n.language === "ar" ? "التالية" : "Next"}
        </button>
      );
    }

    // زر الصفحة الأخيرة
    if (current_page < last_page) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(last_page)}
          className={styles.pageBtn}
        >
          {i18n.language === "ar" ? "الأخيرة" : "Last"}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <section
        className={`${styles.offers} ${
          i18n.language === "ar" ? styles.rtl : styles.ltr
        }`}
      >
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{t("loading") || "Loading..."}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.offers} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className={styles.headerRow}>
        <div className={styles.headings}>
          <h2 className={styles.title}>{t("offers.title")}</h2>
          <p className={styles.subtitle}>{t("offers.subtitle")}</p>
        </div>
      </div>

      {/* شبكة العروض */}
      <div className={styles.grid}>
        {offersData.map((offer) => (
          <div key={offer.id} className={styles.card}>
            <Link to={`/book-details/${offer.id}`} className={styles.cardLink}>
              <div className={styles.thumbWrap}>
                <img
                  src={offer.main_image}
                  alt={offer.title}
                  className={styles.thumb}
                />
                <div className={styles.discountBadge}>-{offer.discount}%</div>
              </div>

              <div className={styles.body}>
                <h3 className={styles.offerTitle}>{offer.title}</h3>
                <p className={styles.desc}>{offer.desc}</p>

                <div className={styles.staticCounter}>
                  <button
                    className={styles.counterBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(offer.id, -1);
                    }}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>
                    {quantities[offer.id] || 0}
                  </span>
                  <button
                    className={styles.counterBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(offer.id, 1);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* السعر والزر */}
                <div className={styles.priceContainer}>
                  <div className={styles.prices}>
                    {offer.fake_price !== "0" && (
                      <span className={styles.originalPrice}>
                        {offer.fake_price} {t("gamestore.currency")}
                      </span>
                    )}
                    <span className={styles.discountPrice}>
                      {offer.real_price} {t("gamestore.currency")}
                    </span>
                  </div>
                  <button className={styles.browseBtn}>
                    {t("gamestore.browse_product")}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* الباجينيشن */}
      {pagination && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <p>
              {i18n.language === "ar" ? "الصفحة" : "Page"}{" "}
              {pagination.current_page} {i18n.language === "ar" ? "من" : "of"}{" "}
              {pagination.last_page}
            </p>
            <p>
              {i18n.language === "ar" ? "إجمالي العروض" : "Total Offers"}:{" "}
              {pagination.total}
            </p>
          </div>
          <div className={styles.paginationButtons}>
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </section>
  );
}

export default AllOffers;
