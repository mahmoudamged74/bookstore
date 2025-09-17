import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { showNotification } from "../utils/notifications";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { i18n } = useTranslation();

  // جلب بيانات الكارت
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const response = await api.get("/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        const allItems = response.data.data.flatMap((cart) => cart.items || []);
        console.log("All cart items:", allItems);
        // تصفية العناصر الصالحة فقط (التي لها product)
        const validItems = allItems.filter((item) => item && item.product);
        console.log("Valid cart items:", validItems);
        setCartItems(validItems);
        setCartCount(validItems.length);
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // إضافة منتج للكارت
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification(
          "error",
          i18n.language === "ar"
            ? "يرجى تسجيل الدخول أولاً"
            : "Please login first"
        );
        return false;
      }

      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("qty", quantity);

      const response = await api.post("/carts/add-items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message ||
            (i18n.language === "ar"
              ? "تم إضافة المنتج للكارت"
              : "Product added to cart")
        );
        await fetchCart(); // تحديث الكارت
        return true;
      } else {
        showNotification(
          "error",
          response.data.message ||
            (i18n.language === "ar"
              ? "فشل في إضافة المنتج"
              : "Failed to add product")
        );
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification(
        "error",
        i18n.language === "ar"
          ? "فشل في إضافة المنتج للكارت"
          : "Failed to add product to cart"
      );
      return false;
    }
  };

  // تحديث كمية منتج في الكارت
  const updateCartItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification(
          "error",
          i18n.language === "ar"
            ? "يرجى تسجيل الدخول أولاً"
            : "Please login first"
        );
        return false;
      }

      const formData = new FormData();
      formData.append("item_id", itemId);
      formData.append("qty", quantity);

      const response = await api.post("/carts/update-items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message ||
            (i18n.language === "ar" ? "تم تحديث الكمية" : "Quantity updated")
        );
        await fetchCart(); // تحديث الكارت
        return true;
      } else {
        showNotification(
          "error",
          response.data.message ||
            (i18n.language === "ar"
              ? "فشل في تحديث الكمية"
              : "Failed to update quantity")
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      showNotification(
        "error",
        i18n.language === "ar"
          ? "فشل في تحديث الكمية"
          : "Failed to update quantity"
      );
      return false;
    }
  };

  // حذف منتج من الكارت
  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification(
          "error",
          i18n.language === "ar"
            ? "يرجى تسجيل الدخول أولاً"
            : "Please login first"
        );
        return false;
      }

      const formData = new FormData();
      formData.append("cart_item_id", itemId);

      const response = await api.post("/carts/delete-items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message ||
            (i18n.language === "ar"
              ? "تم حذف المنتج من الكارت"
              : "Product removed from cart")
        );
        await fetchCart(); // تحديث الكارت
        return true;
      } else {
        showNotification(
          "error",
          response.data.message ||
            (i18n.language === "ar"
              ? "فشل في حذف المنتج"
              : "Failed to remove product")
        );
        return false;
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showNotification(
        "error",
        i18n.language === "ar"
          ? "فشل في حذف المنتج من الكارت"
          : "Failed to remove product from cart"
      );
      return false;
    }
  };

  // حذف الكارت بالكامل
  const clearCart = async (cartId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification(
          "error",
          i18n.language === "ar"
            ? "يرجى تسجيل الدخول أولاً"
            : "Please login first"
        );
        return false;
      }

      const formData = new FormData();
      formData.append("cart_id", cartId);

      const response = await api.post("/carts/delete", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        console.log(`Cart ${cartId} cleared successfully`);
        // لا نعرض notification هنا لأننا نستخدم clearAllCarts
        return true;
      } else {
        console.error(`Failed to clear cart ${cartId}:`, response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  // حذف جميع الكارتات (بعد checkout)
  const clearAllCarts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }

      // جلب جميع الكارتات أولاً
      const response = await api.get("/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        const carts = response.data.data;

        // حذف كل كارت على حدة
        for (const cart of carts) {
          try {
            const formData = new FormData();
            formData.append("cart_id", cart.id);

            const deleteResponse = await api.post("/carts/delete", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            if (deleteResponse.data?.status) {
              console.log(`Cart ${cart.id} deleted successfully`);
            } else {
              console.error(
                `Failed to delete cart ${cart.id}:`,
                deleteResponse.data.message
              );
            }
          } catch (error) {
            console.error(`Error clearing cart ${cart.id}:`, error);
          }
        }

        // تحديث الكارت بعد الحذف
        console.log("Clearing all carts completed, updating cart state...");

        // تحديث الـ state مباشرة
        setCartItems([]);
        setCartCount(0);

        // تحديث من الـ API للتأكد
        await fetchCart();
        console.log("Cart updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing all carts:", error);
      return false;
    }
  };

  // حساب إجمالي السعر
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item && item.product) {
        const price = parseFloat(item.product.real_price) || 0;
        const qty = parseInt(item.qty) || 0;
        return total + price * qty;
      }
      return total;
    }, 0);
  };

  // حساب إجمالي الخصم
  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item && item.product) {
        const fakePrice = parseFloat(item.product.fake_price) || 0;
        const realPrice = parseFloat(item.product.real_price) || 0;
        const qty = parseInt(item.qty) || 0;
        const discount = fakePrice > 0 ? (fakePrice - realPrice) * qty : 0;
        return total + discount;
      }
      return total;
    }, 0);
  };

  // تحديث الكارت عند تغيير اللغة
  useEffect(() => {
    fetchCart();
  }, [i18n.language]);

  // تحديث الكارت عند تسجيل الدخول/الخروج
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, []);

  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearAllCarts,
    getTotalPrice,
    getTotalDiscount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
