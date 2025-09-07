import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { showSuccess, showError, showWarning, showInfo } from '../../utils/notifications';
import styles from "./GameStore.module.css";

function MostSelling() {
    // بيانات تجريبية للكتب حسب التاب
    const booksData = useMemo(() => ({
        teachers: [
            {
                id: "math-teacher-1",
                title: "كتاب الرياضيات للمدرسين",
                image: "/bookPng.jpg",
                desc: "دليل شامل للمدرسين لتدريس الرياضيات مع الأنشطة والتمارين.",
                price: 35.99,
            },
            {
                id: "physics-teacher-1",
                title: "دليل الفيزياء التعليمي",
                image: "/bookPng2.webp",
                desc: "مرجع تعليمي للمدرسين مع التجارب العملية والشرح التفصيلي.",
                price: 38.99,
            },
            {
                id: "chemistry-teacher-1",
                title: "كيمياء المدرسين المتقدمة",
                image: "/bookPng3.jpg",
                desc: "دليل شامل لتدريس الكيمياء مع التجارب والتفاعلات الكيميائية.",
                price: 40.99,
            },
            {
                id: "arabic-teacher-1",
                title: "اللغة العربية للمدرسين",
                image: "/bookPng.jpg",
                desc: "مرجع تعليمي شامل للنحو والصرف والأدب العربي.",
                price: 32.99,
            },
            {
                id: "arabic-teacher-1",
                title: "اللغة العربية للمدرسين",
                image: "/bookPng.jpg",
                desc: "مرجع تعليمي شامل للنحو والصرف والأدب العربي.",
                price: 32.99,
            },
            {
                id: "arabic-teacher-1",
                title: "اللغة العربية للمدرسين",
                image: "/bookPng.jpg",
                desc: "مرجع تعليمي شامل للنحو والصرف والأدب العربي.",
                price: 32.99,
            },
        ],
        external: [
            {
                id: "math-external-1",
                title: "الرياضيات الخارجية المتقدمة",
                image: "/bookPng2.webp",
                desc: "كتاب خارجي متقدم في الرياضيات مع حلول مفصلة.",
                price: 45.99,
            },
            {
                id: "physics-external-1",
                title: "الفيزياء الخارجية الشاملة",
                image: "/bookPng3.jpg",
                desc: "مرجع خارجي شامل في الفيزياء مع التطبيقات العملية.",
                price: 48.99,
            },
            {
                id: "chemistry-external-1",
                title: "الكيمياء الخارجية المتخصصة",
                image: "/bookPng.jpg",
                desc: "كتاب خارجي متخصص في الكيمياء العضوية وغير العضوية.",
                price: 50.99,
            },
            {
                id: "english-external-1",
                title: "اللغة الإنجليزية الخارجية",
                image: "/bookPng2.webp",
                desc: "مرجع خارجي شامل في اللغة الإنجليزية مع القواعد والمحادثة.",
                price: 42.99,
            },
        ],
        stationery: [
            {
                id: "pen-set-1",
                title: "طقم أقلام جاف متعدد الألوان",
                image: "/bookPng3.jpg",
                desc: "طقم أقلام جاف عالية الجودة مع 12 لون مختلف.",
                price: 15.99,
            },
            {
                id: "notebook-set-1",
                title: "دفاتر ملاحظات A4",
                image: "/bookPng.jpg",
                desc: "مجموعة دفاتر ملاحظات عالية الجودة مقاس A4.",
                price: 25.99,
            },
            {
                id: "calculator-1",
                title: "آلة حاسبة علمية",
                image: "/bookPng2.webp",
                desc: "آلة حاسبة علمية متقدمة مع شاشة LCD واضحة.",
                price: 35.99,
            },
            {
                id: "ruler-set-1",
                title: "طقم مساطر هندسية",
                image: "/bookPng3.jpg",
                desc: "طقم مساطر هندسية شاملة مع منقلة وفرجار.",
                price: 12.99,
            },
        ],
    }), []);

    // تعريف activeTab قبل استخدامه
    const [activeTab, setActiveTab] = useState('teachers'); // كتب المدرسين افتراضياً

    const books = booksData[activeTab] || [];


    const [quantities, setQuantities] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);

    // دوال العداد
    const handleQuantityChange = (bookId, change) => {
        // تحقق من تسجيل الدخول
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            setShowLoginModal(true);
            showWarning('تسجيل الدخول مطلوب', 'يجب عليك تسجيل الدخول أولاً لإضافة الكتب إلى السلة');
            return;
        }

        const newQuantity = Math.max(0, (quantities[bookId] || 0) + change);

        setQuantities(prev => ({
            ...prev,
            [bookId]: newQuantity
        }));

        // إظهار إشعارات
        if (change > 0) {
            showSuccess('تم الإضافة!', 'تم إضافة الكتاب إلى السلة بنجاح');
        } else if (change < 0 && newQuantity === 0) {
            showInfo('تم الحذف', 'تم إزالة الكتاب من السلة');
        }
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    // إشعار ترحيبي عند تحميل المكون
    useEffect(() => {
        const timer = setTimeout(() => {
            showSuccess('مرحباً بك!', 'اكتشف أفضل الكتب الدراسية والأدوات المكتبية');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={styles.section} dir="rtl">
            <div className={styles.headerRow}>
                <div className={styles.headings}>
                    <h2 className={styles.title}>الاكثر مبيعا</h2>
                    <p style={{ textAlign: 'center' }} className={styles.subtitle}>
                        أفضل الكتب الدراسية والمراجع العلمية لجميع المراحل التعليمية
                    </p>

                  
                </div>
            </div>

            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                speed={800}
                autoplay={{
                    delay: 3000,
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
                        slidesPerView: 4,
                    }
                }}
                className={styles.swiper}
            >
                {books.map((book) => (
                    <SwiperSlide key={book.id}>
                        <Link to="/book-details" className={`${styles.card} floating-element`}>
                            <div className={styles.thumbWrap}>
                                <img src={book.image} alt={book.title} className={styles.thumb} />
                            </div>

                            <div className={styles.body}>
                                <h3 className={styles.gameTitle}>{book.title}</h3>
                                <p className={styles.desc}>{book.desc}</p>
                                {/* السعر والعداد في نفس السطر */}
                                <div className={styles.priceAndCounter}>
                                    <p className={styles.priceLine}>
                                        السعر: <strong>${book.price.toFixed(2)}</strong>
                                    </p>

                                    {/* عداد الكمية */}
                                    <div className={styles.counterContainer}>
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
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>


            <div className={styles.moreRow}>
                <a href="/books" className={styles.moreLink}>عرض المزيد</a>
            </div>

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
                            <p>يجب عليك تسجيل الدخول أولاً لإضافة الكتب إلى السلة</p>
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

export default MostSelling;
