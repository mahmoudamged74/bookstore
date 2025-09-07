import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from "./gameDetails.module.css";

function GameDetails() {
  const [active, setActive] = useState(0);

  const slides = [
    {
      id: 1,
      src: "/bookPng.jpg",
      title: "الغلاف الأمامي"
    },
    {
      id: 2,
      src: "/bookPng2.webp",
      title: "صفحة المحتويات"
    },
    {
      id: 3,
      src: "/bookPng3.jpg",
      title: "عينة من المحتوى"
    },
    {
      id: 4,
      src: "/bookPng.jpg",
      title: "التمارين"
    },
    {
      id: 5,
      src: "/bookPng2.webp",
      title: "الإجابات"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className={styles.details} dir="rtl">
      <div className="container">
        <div className={styles.header}>
          <h3 className={styles.title}>تفاصيل الكتاب</h3>
          <p className={styles.subtitle}>كتاب الأحياء - الهرمونات والدعامة والحركة</p>
        </div>

        <div className={styles.content} >
        {/* تفاصيل الكتاب (يسار) */}
        <article className={styles.textBox}>
          <div className={styles.bookInfo}>
            <h2 className={styles.bookTitle}>الهرمونات - 3 - أحياء - م. ماجد امام</h2>
            
            <div className={styles.bookDescription}>
              <p>
                <strong>كتاب الشرح والتدريبات في الدعامة والحركة والهرمونات</strong> - نظام حديث
              </p>
              
              <div className={styles.features}>
                <h4>المميزات:</h4>
                <ul>
                  <li>كارت الماجد (هدايا وخصومات على منصة الجيو)</li>
                  <li>ستيكرز تعليمية</li>
                  <li>إقرار الجيو</li>
                  <li>شرح مفصل مع أمثلة عملية</li>
                  <li>تمارين متنوعة ومتدرجة</li>
                </ul>
              </div>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceInfo}>
                <span className={styles.priceLabel}>السعر:</span>
                <span className={styles.price}>100.00 جنيه</span>
              </div>
              
              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>الكمية:</label>
                <div className={styles.quantityControls}>
                  <button className={styles.quantityBtn}>-</button>
                  <span className={styles.quantity}>1</span>
                  <button className={styles.quantityBtn}>+</button>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.addToCartBtn}>أضف إلى السلة</button>
            </div>

            <div className={styles.note}>
              <strong>ملاحظة مهمة:</strong> يمكنك حجز الكتاب مسبقاً لأن هذا الكتاب غير متوفر في المخزن حالياً وسيتم توفيره قريباً.
            </div>
          </div>
        </article>

        {/* يسار: السلايدر */}
        <div className={styles.left}>
          <div className={styles.mainCard}>
            <img
              src={slides[active].src}
              alt={slides[active].title}
              className={styles.mainImg}
            />
            <div className={styles.badge}>{slides[active].title}</div>
          </div>

          {/* نقاط السلايدر */}
          <div className={styles.dots}>
            {slides.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => setActive(i)}
                aria-label={`slide ${i + 1}`}
              />
            ))}
          </div>

          {/* ثَمبنيل تحت - Swiper */}
          <div className={styles.thumbs}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={8}
              slidesPerView={3}
              navigation={false}
              pagination={false}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className={styles.thumbSwiper}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 4,
                },
                300: {
                  slidesPerView: 2,
                  spaceBetween: 6,
                },
                480: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 12,
                }
              }}
            >
              {slides.map((s) => (
                <SwiperSlide key={s.id}>
                  <button
                    className={`${styles.thumb} ${active === slides.findIndex((x) => x.id === s.id) ? styles.thumbActive : ''}`}
                    onClick={() =>
                      setActive(slides.findIndex((x) => x.id === s.id))
                    }
                  >
                    <img src={s.src} alt={s.title} />
                    <span className={styles.thumbLabel}>{s.title}</span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default GameDetails;
