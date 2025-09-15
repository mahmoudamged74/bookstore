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
import styles from "./offers.module.css";

function Offers() {
  const { t, i18n } = useTranslation("global");
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateCartItem, cartItems } = useCart();

  // بيانات احتياطية في حالة فشل API
  const fallbackData = [
    {
      id: "offer-1",
      title: "عرض خاص - كتب الرياضيات",
      main_image: "/bookPng.jpg",
      desc: "خصم 30% على جميع كتب الرياضيات للمرحلة الثانوية",
      fake_price: "50.99",
      real_price: "35.99",
      discount: "30",
      in_cart: false,
    },
    {
      id: "offer-2",
      title: "باقة الكيمياء الشاملة",
      main_image: "/bookPng2.webp",
      desc: "مجموعة كتب الكيمياء مع أدوات المختبر مجاناً",
      fake_price: "120.99",
      real_price: "89.99",
      discount: "25",
      in_cart: false,
    },
    {
      id: "offer-3",
      title: "عرض الأدوات المكتبية",
      main_image: "/bookPng3.jpg",
      desc: "خصم 40% على جميع الأدوات المكتبية والقرطاسية",
      fake_price: "45.99",
      real_price: "27.99",
      discount: "40",
      in_cart: false,
    },
    {
      id: "offer-4",
      title: "باقة اللغات الأجنبية",
      main_image: "/bookPng.jpg",
      desc: "كتب اللغة الإنجليزية والفرنسية بخصم 35%",
      fake_price: "80.99",
      real_price: "52.99",
      discount: "35",
      in_cart: false,
    },
  ];

  // جلب بيانات العروض من API
  useEffect(() => {
    fetchOffersData();
  }, [i18n.language]);

  const fetchOffersData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/home/offers-books-section", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data?.books_data) {
        setOffersData(response.data.data.books_data);
      } else {
        setOffersData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching offers data:", error);
      setOffersData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const [quantities, setQuantities] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // دوال العداد
  const handleQuantityChange = async (offerId, change) => {
    // تحقق من تسجيل الدخول
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      showWarning(
        t("offers.modal.login_required"),
        t("offers.modal.login_message")
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

  const closeLoginModal = () => {
    setShowLoginModal(false);
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

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        speed={800}
        autoplay={{
          delay: 4000,
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
          },
          600: {
            slidesPerView: 1,
          },
          990: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 4,
          },
        }}
        className={styles.swiper}
      >
        {offersData.map((offer) => (
          <SwiperSlide key={offer.id}>
            <div className={`${styles.card} floating-element`}>
              <Link
                to={`/book-details/${offer.id}`}
                className={styles.cardLink}
              >
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

                  {/* عداد الكمية - يظهر بشكل ثابت */}
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
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.moreRow}>
        <Link to="/all-offers" className={styles.moreLink}>
          {t("gamestore.show_more")}
        </Link>
      </div>

      {/* Modal التسجيل */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{t("offers.modal.login_required")}</h3>
              <button className={styles.closeBtn} onClick={closeLoginModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{t("offers.modal.login_message")}</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    window.location.href = "/auth";
                    closeLoginModal();
                  }}
                >
                  {t("offers.modal.login_btn")}
                </button>
                <button className={styles.cancelBtn} onClick={closeLoginModal}>
                  {t("offers.modal.cancel_btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Offers;
