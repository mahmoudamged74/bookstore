import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from "./OtpForgetpass.module.css";

const OtpForgetpass = () => {
  const { t, i18n, ready } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Get phone number from navigation state
  const phone = location.state?.phone;

  // Redirect to forgot password if no phone number
  useEffect(() => {
    if (!phone) {
      toast.error("Phone number not found. Please try again.");
      navigate("/forgot-password");
    }
  }, [phone, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset countdown when component mounts
  useEffect(() => {
    setCountdown(60);
    setCanResend(false);
  }, []);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 4) {
      // Use setTimeout to ensure the state is updated before focusing
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits

    if (pastedData.length > 0) {
      const newOtp = ["", "", "", "", ""]; // Always start fresh

      // Fill the OTP array with pasted data from the beginning
      for (let i = 0; i < Math.min(pastedData.length, 5); i++) {
        newOtp[i] = pastedData[i];
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last filled one
      const lastFilledIndex = newOtp.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 4 ? lastFilledIndex + 1 : 4;

      // Use setTimeout to ensure the state is updated before focusing
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 5) {
      toast.error("Please enter the complete 5-digit code");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", otpCode);

      const response = await api.post("/auth/verifycode", formData);

      if (response.data.status) {
        toast.success(response.data.message);
        navigate("/reset-password", { state: { phone: phone } });
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !phone) return;

    setResendLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone", phone);

      console.log("Resending OTP to phone:", phone);

      const response = await api.post("/auth/sendverifycode", formData);

      if (response.data.status) {
        toast.success("Verification code sent successfully");
        setCountdown(60);
        setCanResend(false);
      } else {
        toast.error(response.data.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to resend code. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className={`${styles.authContainer} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className={styles.authWrapper}>
        {/* Left Side - Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img src="/bookLogo.png" alt="Logo" className={styles.logo} />
            <h1 className={styles.logoText}>{t("auth.logo.title")}</h1>
            <p className={styles.logoSubtext}>{t("auth.logo.subtitle")}</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>{t("auth.otp.title")}</h2>
            <p className={styles.description}>
              {t("auth.otp.description")} {phone && `+${phone}`}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={styles.otpInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>

              <div className={styles.resendContainer}>
                <span>{t("auth.otp.resend_text")}</span>
                <button
                  type="button"
                  className={`${styles.resendBtn} ${
                    !canResend ? styles.disabled : ""
                  }`}
                  onClick={handleResendCode}
                  disabled={!canResend || resendLoading}
                >
                  {resendLoading
                    ? "Sending..."
                    : canResend
                    ? t("auth.otp.resend_btn")
                    : `${t("auth.otp.resend_btn")} (${countdown}s)`}
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Verifying..." : t("auth.otp.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForgetpass;

