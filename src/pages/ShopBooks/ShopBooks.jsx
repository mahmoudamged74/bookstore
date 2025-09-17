import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaBook, FaSpinner } from "react-icons/fa";
import api from "../../services/api";
import styles from "./ShopBooks.module.css";
import { Link } from "react-router-dom";

/**
 * ShopBooks.jsx
 * - يحمّل subjects, teachers, grades
 * - يعرض منتجات مع pagination
 * - يدعم فلاتر subject / teacher / grade
 * - يستخدم lang: i18n.language في الهيدرز
 * - يطبّق debounce على طلبات الفلتر حتى متتحمّل السرفر زيادة
 */

const ShopBooks = () => {
  const { t, i18n } = useTranslation();

  // selected filters
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // lists
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [grades, setGrades] = useState([]);

  // products & loading states
  const [products, setProducts] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // refs
  const debounceRef = useRef(null);
  const metaAbortRef = useRef(null);
  const productsAbortRef = useRef(null);

  // --- Fetch metadata ---
  const fetchInitialData = useCallback(async () => {
    setLoadingMeta(true);
    setError(null);

    try {
      if (metaAbortRef.current) metaAbortRef.current.abort();
      metaAbortRef.current = new AbortController();
      const signal = metaAbortRef.current.signal;

      const langHeader = { headers: { lang: i18n.language || "en" }, signal };

      const [subjectsRes, teachersRes, gradesRes] = await Promise.allSettled([
        api.get("/settings/subjects", langHeader),
        api.get("/settings/teachers", langHeader),
        api.get("/settings/grades", langHeader),
      ]);

      if (
        subjectsRes.status === "fulfilled" &&
        subjectsRes.value?.data?.status
      ) {
        setSubjects(subjectsRes.value.data.data || []);
      } else {
        setSubjects([]);
      }

      if (
        teachersRes.status === "fulfilled" &&
        teachersRes.value?.data?.status
      ) {
        setTeachers(teachersRes.value.data.data || []);
      } else {
        setTeachers([]);
      }

      if (gradesRes.status === "fulfilled" && gradesRes.value?.data?.status) {
        setGrades(gradesRes.value.data.data || []);
      } else {
        setGrades([]);
      }

      if (!signal.aborted) {
        await fetchProducts(1);
      }
    } catch (err) {
      if (err.name !== "AbortError" && err.name !== "CanceledError") {
        setError(t("shopbooks.fetch_error") || "حدث خطأ أثناء جلب البيانات");
      }
    } finally {
      if (!metaAbortRef.current?.signal.aborted) {
        setLoadingMeta(false);
      }
    }
  }, [i18n.language]);

  // --- Fetch products ---
  const fetchProducts = async (page = 1) => {
    setProductsLoading(true);
    setError(null);

    try {
      if (productsAbortRef.current) productsAbortRef.current.abort();
      productsAbortRef.current = new AbortController();
      const signal = productsAbortRef.current.signal;

      let url = "/products";
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("lang", i18n.language || "en");

      if (selectedSubject || selectedTeacher || selectedGrade) {
        url = "/products/filter";
        if (selectedSubject) params.append("subject_id", selectedSubject);
        if (selectedTeacher) params.append("teacher_id", selectedTeacher);
        if (selectedGrade) params.append("grade_id", selectedGrade);
      }

      const config = { headers: { lang: i18n.language || "en" }, signal };
      const resp = await api.get(`${url}?${params.toString()}`, config);

      if (signal.aborted) return;

      if (resp?.data?.status && resp?.data?.data) {
        const data = resp.data.data;
        console.log("API Response data:", data);

        if (Array.isArray(data)) {
          console.log("Using direct array:", data);
          setProducts(data);
          setCurrentPage(resp.data.pagination?.current_page || page);
          setTotalPages(resp.data.pagination?.last_page || 1);
          setTotalProducts(resp.data.pagination?.total || data.length);
        } else if (Array.isArray(data.books_data) || data.books_data) {
          console.log("Using books_data:", data.books_data);
          setProducts(data.books_data || []);
          setCurrentPage(data.pagination?.current_page || page);
          setTotalPages(data.pagination?.last_page || 1);
          setTotalProducts(
            data.pagination?.total || data.books_data?.length || 0
          );
        } else if (Array.isArray(data.products_data) || data.products_data) {
          console.log("Using products_data:", data.products_data);
          setProducts(data.products_data || []);
          setCurrentPage(data.pagination?.current_page || page);
          setTotalPages(data.pagination?.last_page || 1);
          setTotalProducts(
            data.pagination?.total || data.products_data?.length || 0
          );
        } else {
          console.log("Using fallback:", data);
          setProducts(Array.isArray(data) ? data : [data]);
          setCurrentPage(page);
          setTotalPages(1);
          setTotalProducts(Array.isArray(data) ? data.length : 1);
        }
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (err) {
      if (err.name !== "AbortError" && err.name !== "CanceledError") {
        setError(t("shopbooks.fetch_products_error") || "فشل في جلب المنتجات");
      }
    } finally {
      if (!productsAbortRef.current?.signal.aborted) {
        setProductsLoading(false);
      }
    }
  };

  // load metadata when language changes
  useEffect(() => {
    fetchInitialData();
    return () => {
      if (metaAbortRef.current) metaAbortRef.current.abort();
      if (productsAbortRef.current) productsAbortRef.current.abort();
    };
  }, [fetchInitialData]);

  // --- Debounced fetch when filters change ---
  useEffect(() => {
    setCurrentPage(1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchProducts(1);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedSubject, selectedTeacher, selectedGrade, i18n.language]);

  // page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchProducts(page);
  };

  // filter teachers by subject
  const visibleTeachers = selectedSubject
    ? teachers.filter((t) => String(t.subject_id) === String(selectedSubject))
    : teachers;

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedTeacher("");
  };
  const handleTeacherChange = (e) => setSelectedTeacher(e.target.value);
  const handleGradeChange = (e) => setSelectedGrade(e.target.value);

  if (loadingMeta) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("shopbooks.loading") || "جاري التحميل..."}</p>
      </div>
    );
  }

  return (
    <div className={styles.shopBooksContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaBook />
          {t("shopbooks.title") || "تصفح الكتب"}
        </h1>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          {/* Subject */}
          <div className={styles.selectWrapper}>
            <FaChevronDown className={styles.selectIcon} />
            <select
              className={styles.select}
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">
                {t("shopbooks.select_subject") || "اختر المادة"}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div className={styles.selectWrapper}>
            <FaChevronDown className={styles.selectIcon} />
            <select
              className={styles.select}
              value={selectedTeacher}
              onChange={handleTeacherChange}
            >
              <option value="">
                {t("shopbooks.select_teacher") || "اختر المدرس"}
              </option>
              {visibleTeachers.map((tch) => (
                <option key={tch.id} value={tch.id}>
                  {tch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grade */}
          <div className={styles.selectWrapper}>
            <FaChevronDown className={styles.selectIcon} />
            <select
              className={styles.select}
              value={selectedGrade}
              onChange={handleGradeChange}
            >
              <option value="">
                {t("shopbooks.select_grade") || "اختر الصف"}
              </option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBox}>
          <p>{error}</p>
        </div>
      )}

      {/* Products */}
      <div className={styles.productsContainer}>
        {productsLoading ? (
          <div className={styles.productsLoading}>
            <FaSpinner className={styles.spinning} />
            <p>{t("shopbooks.loading_products") || "جاري تحميل المنتجات..."}</p>
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className={`card ${styles.productCard}`}>
                    <div className={styles.cardImageContainer}>
                      <img
                        src={product.main_image || "/placeholder.png"}
                        className={`card-img-top ${styles.cardImage}`}
                        alt={product.title || ""}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      {product.discount > 0 && (
                        <div className={styles.discountBadge}>
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title ${styles.cardTitle}`}>
                        {product.title}
                      </h5>
                      <p className={`card-text ${styles.cardDescription}`}>
                        {product.desc}
                      </p>

                      <div className={styles.productInfo}>
                        {product.subject_name && (
                          <span className={styles.subjectBadge}>
                            {product.subject_name}
                          </span>
                        )}
                        {product.grade_name && (
                          <span className={styles.gradeBadge}>
                            {product.grade_name}
                          </span>
                        )}
                      </div>

                      <div className={styles.priceContainer}>
                        {product.fake_price > 0 && (
                          <span className={styles.fakePrice}>
                            {product.fake_price}{" "}
                            {t("shopbooks.currency") || "ج.م"}
                          </span>
                        )}
                        <span className={styles.realPrice}>
                          {product.real_price}{" "}
                          {t("shopbooks.currency") || "ج.م"}
                        </span>
                      </div>

                      <div className={styles.cardActions}>
                        <Link to={`/book-details/${product.id}`} className={`btn ${styles.viewBtn}`}>
                          {t("shopbooks.view_details") || "عرض التفاصيل"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {t("shopbooks.previous") || "السابق"}
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        {t("shopbooks.next") || "التالي"}
                      </button>
                    </li>
                  </ul>
                </nav>

                <div className={styles.paginationInfo}>
                  <p>
                    {t("shopbooks.showing") || "عرض"} {products.length}{" "}
                    {t("shopbooks.of") || "من"} {totalProducts}{" "}
                    {t("shopbooks.products") || "منتج"}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyProducts}>
            <FaBook className={styles.emptyIcon} />
            <h3>{t("shopbooks.no_products") || "لا توجد منتجات"}</h3>
            <p>
              {t("shopbooks.no_products_message") ||
                "لم يتم العثور على منتجات تطابق المعايير المحددة"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopBooks;
