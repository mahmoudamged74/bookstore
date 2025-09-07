import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    username: '',
    countryCode: '+20'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      phone: '',
      password: '',
      confirmPassword: '',
      username: '',
      countryCode: '+20'
    });
  };

  const countryCodes = [
    { code: '+20', country: 'مصر', flag: '🇪🇬' },
    { code: '+966', country: 'السعودية', flag: '🇸🇦' },
    { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
    { code: '+965', country: 'الكويت', flag: '🇰🇼' },
    { code: '+974', country: 'قطر', flag: '🇶🇦' },
    { code: '+973', country: 'البحرين', flag: '🇧🇭' },
    { code: '+968', country: 'عُمان', flag: '🇴🇲' },
    { code: '+962', country: 'الأردن', flag: '🇯🇴' },
    { code: '+961', country: 'لبنان', flag: '🇱🇧' },
    { code: '+963', country: 'سوريا', flag: '🇸🇾' },
    { code: '+964', country: 'العراق', flag: '🇮🇶' },
    { code: '+213', country: 'الجزائر', flag: '🇩🇿' },
    { code: '+212', country: 'المغرب', flag: '🇲🇦' },
    { code: '+216', country: 'تونس', flag: '🇹🇳' },
    { code: '+218', country: 'ليبيا', flag: '🇱🇾' },
    { code: '+249', country: 'السودان', flag: '🇸🇩' }
  ];

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        {/* Logo Section - Right Side */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img src="/bookLogo2.png" alt="ثانوية ستور" className={styles.logo} />
            <h1 className={styles.logoTitle}>ثانوية ستور</h1>
            <p className={styles.logoSubtitle} style={{textAlign: 'center'}}>
              {isLogin ? 'مرحباً بك مرة أخرى' : 'انضم إلى عالم الكتب التعليمية'}
            </p>
          </div>
          <div className={styles.floatingElements}>
            <div className={styles.floatingCard}>📚</div>
            <div className={styles.floatingCard}>✏️</div>
            <div className={styles.floatingCard}>🎓</div>
            <div className={styles.floatingCard}>📖</div>
          </div>
        </div>

        {/* Form Section - Left Side */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              <p className={styles.formSubtitle}>
                {isLogin 
                  ? 'ادخل بياناتك للوصول إلى حسابك' 
                  : 'املأ البيانات التالية لإنشاء حسابك'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.authForm}>
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="اسم المستخدم"
                    className={styles.authInput}
                    required={!isLogin}
                  />
                  <span className={styles.inputIcon}>👤</span>
                </div>
              )}

              <div className={styles.inputGroup}>
                <div className={styles.phoneInputContainer}>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className={styles.countrySelect}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="رقم الهاتف"
                    className={styles.phoneInput}
                    required
                  />
                </div>
              </div>


              <div className={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="كلمة المرور"
                  className={styles.authInput}
                  required
                />
                <span className={styles.inputIcon}>🔒</span>
              </div>

              {!isLogin && (
                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="تأكيد كلمة المرور"
                    className={styles.authInput}
                    required={!isLogin}
                  />
                  <span className={styles.inputIcon}>🔐</span>
                </div>
              )}

              {isLogin && (
                <div className={styles.forgotPassword}>
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              )}

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>
                  {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                </span>
                <span className={styles.btnIcon}>→</span>
              </button>
            </form>

            <div className={styles.formFooter}>
              <p className={styles.switchText}>
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className={styles.switchBtn}
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </button>
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
