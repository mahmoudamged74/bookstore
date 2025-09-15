import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import styles from "./Cart.module.css";

const Cart = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const {
    cartItems,
    loading,
    updateCartItem,
    removeFromCart,
    getTotalPrice,
    getTotalDiscount,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    const success = await updateCartItem(itemId, newQuantity);
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("cart.loading") || "جاري تحميل الكارت..."}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
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
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img
                  src={item.product.main_image}
                  alt={item.product.title}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              <div className={styles.itemDetails}>
                <h3 className={styles.itemTitle}>{item.product.title}</h3>
                <p className={styles.itemDesc}>{item.product.desc}</p>

                <div className={styles.itemPrices}>
                  {item.product.fake_price > 0 && (
                    <span className={styles.fakePrice}>
                      {item.product.fake_price} {t("cart.currency") || "ج.م"}
                    </span>
                  )}
                  <span className={styles.realPrice}>
                    {item.product.real_price} {t("cart.currency") || "ج.م"}
                  </span>
                  {item.product.discount > 0 && (
                    <span className={styles.discount}>
                      -{item.product.discount}%
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handleQuantityChange(item.id, parseInt(item.qty) - 1)
                    }
                    disabled={
                      updatingItems.has(item.id) || parseInt(item.qty) <= 1
                    }
                  >
                    <FaMinus />
                  </button>

                  <span className={styles.quantity}>
                    {updatingItems.has(item.id) ? (
                      <div className={styles.loadingSpinner}></div>
                    ) : (
                      item.qty
                    )}
                  </span>

                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handleQuantityChange(item.id, parseInt(item.qty) + 1)
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
              <span>{cartItems.length}</span>
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

            <button className={styles.checkoutBtn}>
              {t("cart.checkout") || "إتمام الطلب"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
