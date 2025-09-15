import FloatingAnimations from "../../components/FloatingAnimations/FloatingAnimations";
import styles from './AllGames.module.css';
function AllGames() {
    return (
        <>
            <FloatingAnimations />
            <header className={styles.header} dir="rtl">
                <h2 className={styles.title}>قسم الألعاب</h2>
                <p className={styles.subtitle}>
                    أفضل العروض والخصومات لشحن الألعاب الأكثر شعبية
                </p>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="ابحث هنا عن لعبتك المفضلة"
                        className={styles.input}
                    />
                    <span className={styles.icon}>🔍</span>
                </div>
            </header>
        </>
    )
}

export default AllGames;


