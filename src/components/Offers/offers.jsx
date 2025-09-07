import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { showSuccess, showError, showWarning, showInfo } from '../../utils/notifications';
import styles from "./offers.module.css";

function Offers() {
  // بيانات تجريبية للعروض
  const offersData = useMemo(() => [
    {
      id: "offer-1",
      title: "عرض خاص - كتب الرياضيات",
      image: "/bookPng.jpg",
      desc: "خصم 30% على جميع كتب الرياضيات للمرحلة الثانوية",
      originalPrice: 50.99,
      discountPrice: 35.99,
      discount: 30,
      validUntil: "2024-12-31"
    },
    {
      id: "offer-2", 
      title: "باقة الكيمياء الشاملة",
      image: "/bookPng2.webp",
      desc: "مجموعة كتب الكيمياء مع أدوات المختبر مجاناً",
      originalPrice: 120.99,
      discountPrice: 89.99,
      discount: 25,
      validUntil: "2024-11-30"
    },
    {
      id: "offer-3",
      title: "عرض الأدوات المكتبية",
      image: "/bookPng3.jpg", 
      desc: "خصم 40% على جميع الأدوات المكتبية والقرطاسية",
      originalPrice: 45.99,
      discountPrice: 27.99,
      discount: 40,
      validUntil: "2024-10-31"
    },
    {
      id: "offer-4",
      title: "باقة اللغات الأجنبية",
      image: "/bookPng.jpg",
      desc: "كتب اللغة الإنجليزية والفرنسية بخصم 35%",
      originalPrice: 80.99,
      discountPrice: 52.99,
      discount: 35,
      validUntil: "2024-12-15"
    },
    {
      id: "offer-5",
      title: "عرض الكتب الخارجية",
      image: "/bookPng2.webp",
      desc: "خصم 20% على جميع الكتب الخارجية المتقدمة",
      originalPrice: 75.99,
      discountPrice: 60.99,
      discount: 20,
      validUntil: "2024-11-15"
    },
    {
      id: "offer-6",
      title: "باقة العلوم الطبيعية",
      image: "/bookPng3.jpg",
      desc: "كتب الفيزياء والأحياء والجيولوجيا بخصم 45%",
      originalPrice: 95.99,
      discountPrice: 52.99,
      discount: 45,
      validUntil: "2024-12-20"
    }
  ], []);

  const [quantities, setQuantities] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);

  // دوال العداد
  const handleQuantityChange = (offerId, change) => {
    // تحقق من تسجيل الدخول
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setShowLoginModal(true);
      showWarning('تسجيل الدخول مطلوب', 'يجب عليك تسجيل الدخول أولاً لإضافة العروض إلى السلة');
      return;
    }

    const newQuantity = Math.max(0, (quantities[offerId] || 0) + change);
    
    setQuantities(prev => ({
      ...prev,
      [offerId]: newQuantity
    }));

    // إظهار إشعارات
    if (change > 0) {
      showSuccess('تم الإضافة!', 'تم إضافة العرض إلى السلة بنجاح');
    } else if (change < 0 && newQuantity === 0) {
      showInfo('تم الحذف', 'تم إزالة العرض من السلة');
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // إشعار ترحيبي عند تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      showSuccess('عروض حصرية!', 'اكتشف أفضل العروض والخصومات على الكتب والأدوات');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <section className={styles.offers} dir="rtl">
      <div className={styles.headerRow}>
        <div className={styles.headings}>
          <h2 className={styles.title}>جميع العروض والخصومات</h2>
          <p className={styles.subtitle}>
            اكتشف جميع العروض الحصرية والخصومات المذهلة على أفضل الكتب والأدوات المكتبية
          </p>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        speed={800}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
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
          }
        }}
        className={styles.swiper}
      >
        {offersData.map((offer) => (
          <SwiperSlide key={offer.id}>
            <Link to="/book-details" className={`${styles.card} floating-element`}>
              <div className={styles.thumbWrap}>
                <img src={offer.image} alt={offer.title} className={styles.thumb} />
                <div className={styles.discountBadge}>
                  -{offer.discount}%
                </div>
              </div>

              <div className={styles.body}>
                <h3 className={styles.offerTitle}>{offer.title}</h3>
                <p className={styles.desc}>{offer.desc}</p>
                
                {/* السعر والعداد في نفس السطر */}
                <div className={styles.priceAndCounter}>
                  <div className={styles.prices}>
                    <span className={styles.originalPrice}>${offer.originalPrice.toFixed(2)}</span>
                    <span className={styles.discountPrice}>${offer.discountPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* عداد الكمية */}
                  <div className={styles.counterContainer}>
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
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* تم إزالة رابط "عرض جميع العروض" لأننا في صفحة العروض الكاملة */}

      {/* Modal التسجيل */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>تسجيل الدخول مطلوب</h3>
              <button 
                className={styles.closeBtn}
                onClick={closeLoginModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>يجب عليك تسجيل الدخول أولاً لإضافة العروض إلى السلة</p>
              <div className={styles.modalActions}>
                <button 
                  className={styles.loginBtn}
                  onClick={() => {
                    window.location.href = '/auth';
                    closeLoginModal();
                  }}
                >
                  تسجيل الدخول
                </button>
                <button 
                  className={styles.cancelBtn}
                  onClick={closeLoginModal}
                >
                  إلغاء
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
