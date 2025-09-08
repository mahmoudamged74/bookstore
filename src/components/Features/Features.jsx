import React from "react";
import styles from "./Features.module.css";

function Features() {
  const featuresData = [
    {
      id: 1,
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png", // سماعة
      title: "دعم فني ٢٤ ساعة",
      description: "على مدار الأسبوع",
    },
    {
      id: 2,
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png", // كتب
      title: "كل كتب الثانوية العامة",
      description: "للمدرسين اللي بتحبهم",
    },
    {
      id: 3,
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // دولار
      title: "أقل سعر شحن",
      description: "في مصر",
    },
    {
      id: 4,
      icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // توصيل
      title: "توصيل لأي حته",
      description: "في مصر",
    },
    {
      id: 5,
      icon: "https://cdn-icons-png.flaticon.com/512/2753/2753611.png", // صاروخ
      title: "مدة توصيل من ٣ - ٧ أيام عمل",
      description: "بحد أقصى",
    },
    {
      id: 6,
      icon: "https://cdn-icons-png.flaticon.com/512/2583/2583785.png", // هدية
      title: "عروض ومسابقات وخدمات كتير",
      description: "على أوردراتنا",
    },
  ];

  return (
    <section className={styles.features} dir="rtl">
      <div className="container">
        {/* النص الرئيسي */}
        <div className={styles.header}>
          <p className={styles.mainText}>
            يا صديق ثانوية ستور، احنا مش بنشتغل عشان نشتغل، احنا بنشتغل بطريقة
            تخليك متأكد إننا خطوة قدام كل حد. ليه؟ عشان احنا بنفكر مختلف، بنركز
            على التفاصيل الصغيرة اللي بتحقق الفرق، وبنقدم حلول مفيش حد تاني
            عنده. احنا هنا عشان نكبر سوا وننجح سوا.
          </p>
        </div>

        {/* شبكة الكاردات */}
        <div className="row g-4">
          {featuresData.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className={styles.featureCard}>
                <div className={styles.iconContainer}>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className={styles.icon}
                  />
                </div>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.description}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
