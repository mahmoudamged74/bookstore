// GameDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "../../services/api";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../utils/notifications";
import { useCart } from "../../context/CartContext";
import styles from "./gameDetails.module.css";

function GameDetails() {
  const { t, i18n } = useTranslation("global");
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { addToCart, cartItems } = useCart();

  // جلب بيانات المنتج من API
  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id, i18n.language]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        lang: i18n.language || "en",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await api.get(`/products/${id}`, { headers });

      if (response.data?.status && response.data?.data) {
        setProductData(response.data.data);
        // تحديث تاتيل الصفحة
        document.title =
          i18n.language === "ar"
            ? response.data.data.title
            : response.data.data.title;
      } else {
        showError("خطأ", "لم يتم العثور على المنتج");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      showError("خطأ", "حدث خطأ في جلب بيانات المنتج");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // تحديث السلايدر عند تغيير البيانات
  useEffect(() => {
    if (productData?.slider && productData.slider.length > 0) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % productData.slider.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [productData?.slider]);

  // تحديث الكمية بناءً على الكارت
  useEffect(() => {
    if (productData && cartItems && cartItems.length > 0) {
      const cartItem = cartItems.find(
        (item) => item && item.product && item.product.id === parseInt(id)
      );
      if (cartItem) {
        setQuantity(parseInt(cartItem.qty));
      }
    }
  }, [cartItems, productData, id]);

  // دوال الكمية
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  // دالة إضافة للسلة
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      showWarning(
        "تسجيل الدخول مطلوب",
        "يجب عليك تسجيل الدخول أولاً لإضافة المنتج إلى السلة"
      );
      return;
    }

    // إضافة المنتج للكارت بالكمية المحددة
    const success = await addToCart(parseInt(id), quantity);

    if (success) {
      showSuccess(
        "تم الإضافة!",
        `تم إضافة ${quantity} من ${productData?.title} إلى السلة`
      );
    }
  };

  // دالة إغلاق الموديل
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <section
        className={`${styles.details} ${
          i18n.language === "ar" ? styles.rtl : styles.ltr
        }`}
      >
        <div className="container">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>{t("loading") || "Loading..."}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!productData) {
    return (
      <section
        className={`${styles.details} ${
          i18n.language === "ar" ? styles.rtl : styles.ltr
        }`}
      >
        <div className="container">
          <div className={styles.error}>
            <h3>لم يتم العثور على المنتج</h3>
            <button onClick={() => navigate("/")}>العودة للرئيسية</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.details} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className="container">
        {/* الهيدر */}
        <div className={styles.header}>
          <h3 className={styles.title}>{productData.title}</h3>
          <p className={styles.subtitle}>{productData.subtitle}</p>
        </div>

        {/* المحتوى */}
        <div className="row g-4 align-items-start">
          {/* نصوص الكتاب */}
          <div className="col-12 col-lg-7">
            <article className={styles.textBox}>
              <div className={styles.bookInfo}>
                <h2 className={styles.bookTitle}>{productData.title}</h2>

                <div className={styles.bookDescription}>
                  <p>
                    {/* <strong>{t("book_details.book_description")}</strong> -{" "} */}
                    {productData.desc}
                  </p>

                  {productData.features && productData.features.length > 0 && (
                    <div className={styles.features}>
                      <h4>{t("book_details.features_title")}:</h4>
                      <ul>
                        {productData.features.map((feature) => (
                          <li key={feature.id}>{feature.text}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.priceInfo}>
                    <span className={styles.priceLabel}>
                      {t("book_details.price")}
                    </span>
                    <div className={styles.prices}>
                      {productData.fake_price !== "0" && (
                        <span className={styles.originalPrice}>
                          {productData.fake_price} {t("gamestore.currency")}
                        </span>
                      )}
                      <span className={styles.price}>
                        {productData.real_price} {t("gamestore.currency")}
                      </span>
                      {productData.discount && productData.discount !== "0" && (
                        <span className={styles.discountBadge}>
                          -{productData.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.quantitySection}>
                    <label className={styles.quantityLabel}>
                      {t("book_details.quantity")}:
                    </label>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(-1)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                  >
                    {t("book_details.add_to_cart")}
                  </button>
                </div>

                {productData.note && (
                  <div className={styles.note}>
                    <strong>{t("book_details.important_note")}:</strong>{" "}
                    {productData.note}
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* السلايدر */}
          <div className="col-12 col-lg-5">
            <div className={styles.left}>
              {productData.slider && productData.slider.length > 0 ? (
                <>
                  <div className={styles.mainCard}>
                    <img
                      src={productData.slider[active].image}
                      alt={productData.title}
                      className={styles.mainImg}
                    />
                    <div className={styles.badge}>
                      {i18n.language === "ar" ? "صورة المنتج" : "Product Image"}
                    </div>
                  </div>

                  {/* نقاط السلايدر */}
                  <div className={styles.dots}>
                    {productData.slider.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.dot} ${
                          i === active ? styles.dotActive : ""
                        }`}
                        onClick={() => setActive(i)}
                        aria-label={`slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* الصور المصغرة */}
                  <div className={styles.thumbs}>
                    <div className={styles.thumbContainer}>
                      {productData.slider.map((slide, index) => (
                        <button
                          key={slide.id}
                          className={`${styles.thumb} ${
                            active === index ? styles.thumbActive : ""
                          }`}
                          onClick={() => setActive(index)}
                        >
                          <img src={slide.image} alt={productData.title} />
                          <span className={styles.thumbLabel}>
                            {i18n.language === "ar"
                              ? "صورة المنتج"
                              : "Product Image"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.noImages}>
                  <p>
                    {i18n.language === "ar"
                      ? "لا توجد صور متاحة"
                      : "No images available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default GameDetails;
