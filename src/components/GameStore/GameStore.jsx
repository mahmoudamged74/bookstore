import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../../services/api";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../utils/notifications";
import { useCart } from "../../context/CartContext";
import styles from "./GameStore.module.css";

function GameStore() {
  const { t, i18n, ready } = useTranslation("global");
  const [booksData, setBooksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateCartItem, removeFromCart, cartItems } = useCart();

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  // بيانات احتياطية في حالة فشل API
  const fallbackData = [
    {
      id: "math-teacher-1",
      title: t("gamestore.books.teachers.math.title"),
      main_image: "/bookPng.jpg",
      desc: t("gamestore.books.teachers.math.desc"),
      real_price: "35.99",
      fake_price: "0",
      discount: "0",
      in_cart: false,
    },
    {
      id: "physics-teacher-1",
      title: t("gamestore.books.teachers.physics.title"),
      main_image: "/bookPng2.webp",
      desc: t("gamestore.books.teachers.physics.desc"),
      real_price: "38.99",
      fake_price: "0",
      discount: "0",
      in_cart: false,
    },
    {
      id: "chemistry-teacher-1",
      title: t("gamestore.books.teachers.chemistry.title"),
      main_image: "/bookPng3.jpg",
      desc: t("gamestore.books.teachers.chemistry.desc"),
      real_price: "40.99",
      fake_price: "0",
      discount: "0",
      in_cart: false,
    },
    {
      id: "arabic-teacher-1",
      title: t("gamestore.books.teachers.arabic.title"),
      main_image: "/bookPng.jpg",
      desc: t("gamestore.books.teachers.arabic.desc"),
      real_price: "32.99",
      fake_price: "0",
      discount: "0",
      in_cart: false,
    },
  ];

  // جلب بيانات الكتب من API
  useEffect(() => {
    fetchBooksData();
  }, [i18n.language]);

  const fetchBooksData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/home/teacher-books-section", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data?.books_data) {
        setBooksData(response.data.data.books_data);
      } else {
        setBooksData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching books data:", error);
      setBooksData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // تعريف activeTab قبل استخدامه
  const [activeTab, setActiveTab] = useState("teachers"); // كتب المدرسين افتراضياً

  const books = booksData || [];

  const [quantities, setQuantities] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(new Set());

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

  // دوال العداد - تعمل محلياً فقط
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
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      showWarning(
        "تسجيل الدخول مطلوب",
        "يجب عليك تسجيل الدخول أولاً لإضافة الكتب إلى السلة"
      );
      return;
    }

    const quantity = quantities[bookId] || 0;
    if (quantity === 0) {
      showWarning("كمية غير صحيحة", "يرجى تحديد كمية أكبر من صفر");
      return;
    }

    setAddingToCart((prev) => new Set(prev).add(bookId));

    try {
      const success = await addToCart(bookId, quantity);
      if (success) {
        // إعادة تعيين العداد بعد الإضافة الناجحة
        setQuantities((prev) => ({
          ...prev,
          [bookId]: 0,
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
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

          {/* نظام الـ Tabs */}
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "teachers" ? styles.activeTab : ""
              }`}
              onClick={() => {
                setActiveTab("teachers");
                // showInfo("تم التبديل", "عرض كتب المدرسين");
              }}
            >
              {t("gamestore.tabs.teachers")}
            </button>
            {/* <button
              className={`${styles.tab} ${
                activeTab === "external" ? styles.activeTab : ""
              }`}
              onClick={() => {
                setActiveTab("external");
                showInfo("تم التبديل", "عرض الكتب الخارجية");
              }}
            >
              الكتب الخارجية
            </button> */}
            {/* <button
              className={`${styles.tab} ${
                activeTab === "stationery" ? styles.activeTab : ""
              }`}
              onClick={() => {
                setActiveTab("stationery");
                showInfo("تم التبديل", "عرض الأدوات المكتبية");
              }}
            >
              أدوات مكتبية
            </button> */}
          </div>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className={styles.swiper}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <div className={`${styles.card} floating-element`}>
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
                        addingToCart.has(book.id) ||
                        (quantities[book.id] || 0) === 0
                      }
                    >
                      {addingToCart.has(book.id) ? (
                        <>
                          <div className={styles.loadingSpinner}></div>
                          {t("gamestore.adding_to_cart") || "جاري الإضافة..."}
                        </>
                      ) : (
                        t("gamestore.add_to_cart") || "إضافة للكارت"
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.moreRow}>
        <Link to="/all-teacher-books" className={styles.moreLink}>
          {t("gamestore.show_more")}
        </Link>
      </div>

      {/* Modal التسجيل */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{t("gamestore.modal.login_required")}</h3>
              <button className={styles.closeBtn} onClick={closeLoginModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{t("gamestore.modal.login_message")}</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    window.location.href = "/login";
                    closeLoginModal();
                  }}
                >
                  {t("gamestore.modal.login_btn")}
                </button>
                <button className={styles.cancelBtn} onClick={closeLoginModal}>
                  {t("gamestore.modal.cancel_btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GameStore;
