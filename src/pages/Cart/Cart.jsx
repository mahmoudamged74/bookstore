import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import { showSuccess, showError, showWarning } from "../../utils/notifications";
import styles from "./Cart.module.css";

const Cart = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearAllCarts,
    getTotalPrice,
    getTotalDiscount,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [localQuantities, setLocalQuantities] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Checkout states
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [address, setAddress] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // تحديث الكميات المحلية عند تغيير الكارت
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const quantities = {};
      cartItems.forEach((item) => {
        if (item && item.id) {
          quantities[item.id] = parseInt(item.qty);
        }
      });
      setLocalQuantities(quantities);
      setHasChanges(false);
    }
  }, [cartItems]);

  // جلب المدن والمناطق
  useEffect(() => {
    fetchCitiesAndRegions();
  }, [i18n.language]);

  const fetchCitiesAndRegions = async () => {
    try {
      // جلب المدن
      const citiesResponse = await api.get("/settings/cities", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (citiesResponse.data?.status && citiesResponse.data?.data) {
        setCities(citiesResponse.data.data);
      }

      // جلب المناطق (افتراضياً للمدينة الأولى)
      if (citiesResponse.data?.data?.length > 0) {
        const firstCityId = citiesResponse.data.data[0].id;
        fetchRegions(firstCityId);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchRegions = async (cityId) => {
    try {
      const regionsResponse = await api.get(`/settings/regions/${cityId}`, {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (regionsResponse.data?.status && regionsResponse.data?.data) {
        setRegions(regionsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setSelectedRegion(""); // إعادة تعيين المنطقة عند تغيير المدينة
    fetchRegions(cityId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1 || !itemId) return;

    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
    setHasChanges(true);
  };

  // دالة تحديث الكارت
  const handleUpdateCart = async () => {
    setUpdatingItems(new Set(Object.keys(localQuantities)));

    try {
      const updatePromises = Object.entries(localQuantities).map(
        async ([itemId, quantity]) => {
          const cartItem = cartItems.find(
            (item) => item && item.id === parseInt(itemId)
          );
          if (cartItem && parseInt(cartItem.qty) !== quantity) {
            return await updateCartItem(parseInt(itemId), quantity);
          }
          return true;
        }
      );

      await Promise.all(updatePromises);
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdatingItems(new Set());
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (itemId) {
      await removeFromCart(itemId);
    }
  };

  // دالة الانتقال لصفحة تفاصيل المنتج
  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/book-details/${productId}`);
    }
  };

  // دالة Checkout
  const handleCheckout = async () => {
    if (!selectedCity || !selectedRegion || !address.trim()) {
      showWarning("بيانات ناقصة", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("city_id", selectedCity);
      formData.append("region_id", selectedRegion);

      const response = await api.post("/orders/checkout", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        // عرض رسالة النجاح من الـ API
        showSuccess(
          "تم إتمام الطلب بنجاح!",
          response.data.message || "تم إتمام الطلب بنجاح"
        );

        // إعادة تعيين النموذج
        setAddress("");
        setSelectedCity("");
        setSelectedRegion("");
        setShowCheckoutForm(false);

        // تنظيف الكارت بعد نجاح الطلب
        // استخدام clearAllCarts لحذف جميع الكارتات
        if (validCartItems && validCartItems.length > 0) {
          console.log("Starting to clear cart after successful checkout...");
          await clearAllCarts();
          console.log("Cart clearing completed");
        }
      } else {
        showError(
          "خطأ في الطلب",
          response.data.message || "حدث خطأ أثناء إتمام الطلب"
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showError(
        "خطأ في الطلب",
        error.response?.data?.message || "حدث خطأ أثناء إتمام الطلب"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("cart.loading") || "جاري تحميل الكارت..."}</p>
      </div>
    );
  }

  // Filter out items with null products
  const validCartItems = cartItems.filter((item) => item.product);
  console.log("Cart items:", cartItems);
  console.log("Valid cart items:", validCartItems);

  if (validCartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>
          <FaShoppingCart />
        </div>
        <h2>{t("cart.empty.title") || "الكارت فارغ"}</h2>
        <p>{t("cart.empty.message") || "لم تقم بإضافة أي منتجات للكارت بعد"}</p>
        <Link to="/" className={styles.continueShopping}>
          <FaArrowLeft />
          {t("cart.empty.continue_shopping") || "متابعة التسوق"}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>
          <FaShoppingCart />
          {t("cart.title") || "سلة التسوق"}
        </h1>
        <Link to="/" className={styles.backToShop}>
          <FaArrowLeft />
          {t("cart.back_to_shop") || "العودة للتسوق"}
        </Link>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {validCartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div
                className={styles.itemImage}
                onClick={() =>
                  item.product && handleProductClick(item.product.id)
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.product?.main_image || "/placeholder.png"}
                  alt={item.product?.title || "Product"}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              <div
                className={styles.itemDetails}
                onClick={() =>
                  item.product && handleProductClick(item.product.id)
                }
                style={{ cursor: "pointer" }}
              >
                <h3 className={styles.itemTitle}>
                  {item.product?.title || "Product Title"}
                </h3>
                <p className={styles.itemDesc}>
                  {item.product?.desc || "Product Description"}
                </p>

                <div className={styles.itemPrices}>
                  {item.product?.fake_price > 0 && (
                    <span className={styles.fakePrice}>
                      {item.product?.fake_price} {t("cart.currency") || "ج.م"}
                    </span>
                  )}
                  <span className={styles.realPrice}>
                    {item.product?.real_price || 0}{" "}
                    {t("cart.currency") || "ج.م"}
                  </span>
                  {item.product?.discount > 0 && (
                    <span className={styles.discount}>
                      -{item.product?.discount}%
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        (localQuantities[item.id] || parseInt(item.qty) || 1) -
                          1
                      )
                    }
                    disabled={
                      updatingItems.has(item.id) ||
                      (localQuantities[item.id] || parseInt(item.qty) || 1) <= 1
                    }
                  >
                    <FaMinus />
                  </button>

                  <span className={styles.quantity}>
                    {updatingItems.has(item.id) ? (
                      <div className={styles.loadingSpinner}></div>
                    ) : (
                      localQuantities[item.id] || item.qty || 1
                    )}
                  </span>

                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        (localQuantities[item.id] || parseInt(item.qty) || 1) +
                          1
                      )
                    }
                    disabled={updatingItems.has(item.id)}
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item.id)}
                  title={t("cart.remove_item") || "حذف المنتج"}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <div className={styles.summaryCard}>
            <h3>{t("cart.summary.title") || "ملخص الطلب"}</h3>

            <div className={styles.summaryRow}>
              <span>{t("cart.summary.items_count") || "عدد المنتجات"}</span>
              <span>{validCartItems.length}</span>
            </div>

            {getTotalDiscount() > 0 && (
              <div className={styles.summaryRow}>
                <span>{t("cart.summary.discount") || "الخصم"}</span>
                <span className={styles.discountAmount}>
                  -{getTotalDiscount().toFixed(2)} {t("cart.currency") || "ج.م"}
                </span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>{t("cart.summary.total") || "الإجمالي"}</span>
              <span className={styles.totalAmount}>
                {getTotalPrice().toFixed(2)} {t("cart.currency") || "ج.م"}
              </span>
            </div>

            {hasChanges && (
              <button
                className={styles.updateCartBtn}
                onClick={handleUpdateCart}
                disabled={updatingItems.size > 0}
              >
                {updatingItems.size > 0 ? (
                  <>
                    <div className={styles.loadingSpinner}></div>
                    {t("cart.updating") || "جاري التحديث..."}
                  </>
                ) : (
                  t("cart.update_cart") || "تحديث الكارت"
                )}
              </button>
            )}

            <button
              className={styles.checkoutBtn}
              onClick={() => setShowCheckoutForm(true)}
              disabled={updatingItems.size > 0 || hasChanges}
            >
              {t("cart.checkout") || "إتمام الطلب"}
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutForm && (
        <div className={styles.checkoutModal}>
          <div className={styles.checkoutForm}>
            <div className={styles.checkoutHeader}>
              <h3>{t("cart.checkout_form.title") || "إتمام الطلب"}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowCheckoutForm(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.checkoutBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaCity />
                  {t("cart.checkout_form.city") || "المدينة"}
                </label>
                <select
                  className={styles.formSelect}
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  required
                >
                  <option style={{ color: "#000" }} value="">
                    {t("cart.checkout_form.select_city") || "اختر المدينة"}
                  </option>
                  {cities.map((city) => (
                    <option
                      style={{ color: "#000" }}
                      key={city.id}
                      value={city.id}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaGlobe />
                  {t("cart.checkout_form.region") || "المنطقة"}
                </label>
                <select
                  className={styles.formSelect}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  required
                  disabled={!selectedCity}
                >
                  <option style={{ color: "#000" }} value="">
                    {t("cart.checkout_form.select_region") || "اختر المنطقة"}
                  </option>
                  {regions.map((region) => (
                    <option
                      style={{ color: "#000" }}
                      key={region.id}
                      value={region.id}
                    >
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaMapMarkerAlt />
                  {t("cart.checkout_form.address") || "العنوان التفصيلي"}
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    t("cart.checkout_form.address_placeholder") ||
                    "أدخل عنوانك التفصيلي..."
                  }
                  rows={3}
                  required
                />
              </div>

              <div className={styles.checkoutActions}>
                <button
                  className={styles.cancelCheckoutBtn}
                  onClick={() => setShowCheckoutForm(false)}
                  disabled={isCheckoutLoading}
                >
                  {t("cart.checkout_form.cancel") || "إلغاء"}
                </button>
                <button
                  className={styles.confirmCheckoutBtn}
                  onClick={handleCheckout}
                  disabled={
                    isCheckoutLoading ||
                    !selectedCity ||
                    !selectedRegion ||
                    !address.trim()
                  }
                >
                  {isCheckoutLoading ? (
                    <>
                      <div className={styles.loadingSpinner}></div>
                      {t("cart.checkout_form.processing") || "جاري المعالجة..."}
                    </>
                  ) : (
                    t("cart.checkout_form.confirm") || "تأكيد الطلب"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
