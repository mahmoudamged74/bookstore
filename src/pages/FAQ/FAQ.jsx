import React, { useState } from "react";
import styles from "./FAQ.module.css";

function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "كيف يمكنني طلب الكتب؟",
      answer: "يمكنك طلب الكتب بسهولة من خلال تصفح الموقع واختيار الكتب المطلوبة، ثم إضافتها إلى السلة والانتقال إلى صفحة الدفع. نحن نقدم طرق دفع متعددة وآمنة."
    },
    {
      id: 2,
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نحن نقبل الدفع نقداً عند الاستلام، التحويل البنكي، والدفع الإلكتروني عبر البطاقات الائتمانية. جميع المعاملات آمنة ومحمية."
    },
    {
      id: 3,
      question: "كم تستغرق عملية التوصيل؟",
      answer: "نوصل الطلبات خلال 2-5 أيام عمل داخل القاهرة، و3-7 أيام للمحافظات الأخرى. التوصيل مجاني للطلبات التي تزيد عن 500 جنيه."
    },
    {
      id: 4,
      question: "هل يمكنني إرجاع أو استبدال الكتب؟",
      answer: "نعم، يمكنك إرجاع أو استبدال الكتب خلال 14 يوماً من تاريخ الشراء، بشرط أن تكون في حالة جيدة ومغلقة."
    },
    {
      id: 5,
      question: "هل تقدمون خصومات للطلاب؟",
      answer: "نعم، نقدم خصومات خاصة للطلاب تصل إلى 20% على الكتب الدراسية. يمكنك الحصول على الخصم عند إثبات صفة الطالب."
    },
    {
      id: 6,
      question: "كيف يمكنني التواصل مع خدمة العملاء؟",
      answer: "يمكنك التواصل معنا عبر الهاتف: 01234567890، أو عبر الواتساب، أو البريد الإلكتروني: info@thanawyastore.com. نحن متاحون 24/7 لخدمتكم."
    },
    {
      id: 7,
      question: "هل توجد كتب للصفوف المختلفة؟",
      answer: "نعم، لدينا كتب لجميع المراحل التعليمية من الابتدائي حتى الثانوي، بالإضافة إلى الكتب الجامعية والمراجع العلمية."
    },
    {
      id: 8,
      question: "ما هي جودة الكتب المقدمة؟",
      answer: "جميع كتبنا أصلية ومطابقة للمناهج الرسمية، مع ضمان الجودة العالية والطباعة الواضحة. نحن نتعامل مع أفضل دور النشر المعتمدة."
    }
  ];

  const toggleItem = (id) => {
    console.log('Toggling item:', id, 'Current open:', openItem);
    if (openItem === id) {
      // إذا كان نفس الـ item مفتوح، أغلقه
      setOpenItem(null);
    } else {
      // إذا كان item مختلف، افتحه وأغلق الباقي
      setOpenItem(id);
    }
  };

  return (
    <div className={styles.faqPage} dir="rtl">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>الأسئلة الشائعة</h1>
          <p className={styles.heroSubtitle}>
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا ومنتجاتنا
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className={styles.faqContent}>
        <div className={styles.container}>
          <div className={styles.faqList}>
            {faqData.map((item) => (
              <div key={item.id} className={styles.faqItem}>
                <button
                  className={`${styles.faqQuestion} ${openItem === item.id ? styles.active : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  <span className={styles.arrow}>
                    {openItem === item.id ? '−' : '+'}
                  </span>
                </button>
                <div className={`${styles.faqAnswer} ${openItem === item.id ? styles.open : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
