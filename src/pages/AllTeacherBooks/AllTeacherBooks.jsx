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
import { FaSpinner } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import styles from "./AllTeacherBooks.module.css";

function AllTeacherBooks() {
  const { t, i18n, ready } = useTranslation("global");
  const [booksData, setBooksData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart, updateCartItem, removeFromCart, cartItems } = useCart();

  // تحديث تاتيل الصفحة
  useEffect(() => {
    document.title = i18n.language === "ar" ? "كتب المدرسين" : "Teacher Books";
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

  // جلب بيانات الكتب من API
  useEffect(() => {
    fetchBooksData();
  }, [i18n.language, currentPage]);

  const fetchBooksData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/home/teacher-books-section?page=${currentPage}`,
        {
          headers: {
            lang: i18n.language || "en",
          },
        }
      );

      if (response.data?.status && response.data?.data) {
        setBooksData(response.data.data.books_data || []);
        setPagination(response.data.data.pagination || null);
      } else {
        setBooksData([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching books data:", error);
      setBooksData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // دوال العداد المحلي
  const handleQuantityChange = (bookId, change) => {
    const currentQuantity = quantities[bookId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    // تحديث العداد المحلي فقط
    setQuantities((prev) => ({
      ...prev,
      [bookId]: newQuantity,
    }));
  };

  // دالة إضافة للكارت
  const handleAddToCart = async (bookId) => {
    // تحقق من تسجيل الدخول
    const token = localStorage.getItem("token");
    if (!token) {
      showWarning(
        "تسجيل الدخول مطلوب",
        "يجب عليك تسجيل الدخول أولاً لإضافة الكتب إلى السلة"
      );
      return;
    }

    const quantity = quantities[bookId] || 0;
    if (quantity === 0) {
      showWarning("الكمية مطلوبة", "يرجى تحديد كمية أكبر من صفر");
      return;
    }

    try {
      setAddingToCart((prev) => ({ ...prev, [bookId]: true }));

      const success = await addToCart(bookId, quantity);

      if (success) {
        showSuccess("تم الإضافة بنجاح", "تم إضافة الكتاب إلى السلة بنجاح");
        // إعادة تعيين العداد المحلي
        setQuantities((prev) => ({
          ...prev,
          [bookId]: 0,
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("خطأ في الإضافة", "حدث خطأ أثناء إضافة الكتاب إلى السلة");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [bookId]: false }));
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
        className={`${styles.section} ${
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
      className={`${styles.section} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className={styles.headerRow}>
        <div className={styles.headings}>
          <h2 className={styles.title}>{t("gamestore.title")}</h2>
          <p style={{ textAlign: "center" }} className={styles.subtitle}>
            {t("gamestore.subtitle")}
          </p>
        </div>
      </div>

      {/* شبكة الكتب */}
      <div className={styles.grid}>
        {booksData.map((book) => (
          <div key={book.id} className={styles.card}>
            <Link to={`/book-details/${book.id}`} className={styles.cardLink}>
              <div className={styles.thumbWrap}>
                <img
                  src={book.main_image}
                  alt={book.title}
                  className={styles.thumb}
                />
              </div>

              <div className={styles.body}>
                <h3 className={styles.gameTitle}>{book.title}</h3>
                <p className={styles.desc}>{book.desc}</p>

                <div className={styles.staticCounter}>
                  <button
                    className={styles.counterBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(book.id, -1);
                    }}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>
                    {quantities[book.id] || 0}
                  </span>
                  <button
                    className={styles.counterBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(book.id, 1);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* السعر والزر */}
                <div className={styles.priceContainer}>
                  <p className={styles.priceLine}>
                    <strong>
                      {book.real_price} {t("gamestore.currency")}
                    </strong>
                  </p>
                  <button
                    className={styles.browseBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(book.id);
                    }}
                    disabled={
                      addingToCart[book.id] || (quantities[book.id] || 0) === 0
                    }
                  >
                    {addingToCart[book.id] ? (
                      <>
                        <FaSpinner className={styles.loadingSpinner} />
                        {t("gamestore.adding_to_cart") || "Adding..."}
                      </>
                    ) : (
                      t("gamestore.add_to_cart") || "Add to Cart"
                    )}
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
              {i18n.language === "ar" ? "إجمالي الكتب" : "Total Books"}:{" "}
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

export default AllTeacherBooks;
