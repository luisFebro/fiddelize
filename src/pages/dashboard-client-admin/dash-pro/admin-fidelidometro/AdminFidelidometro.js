import convertToReal from "../../../../utils/numbers/convertToReal";
import AdminPrizesBtn from "./admin-prizes-modal/AdminPrizesBtn";

const getStyles = () => ({
    root: {
        height: 270,
        background: "var(--themeP)",
        borderRadius: 40,
    },
    score: {
        background: "#fff",
        borderRadius: 30,
    },
});

export default function AdminFidelidometro({ loading, totalScore }) {
    const styles = getStyles();
    totalScore = convertToReal(totalScore);

    const showScore = () => (
        <section className="container-center">
            <div
                className="text-em-2-3 main-font my-4 px-3 text-purple text-center font-weight-bold"
                style={{
                    background: "rgb(255, 255, 255)",
                    borderRadius: 30,
                    display: "table",
                }}
            >
                {totalScore ? totalScore || 0 : "..."} pontos
            </div>
        </section>
    );

    const showPrizeGalleryBtn = () => (
        <section className="my-3 container-center">
            <AdminPrizesBtn />
        </section>
    );

    return (
        <section className="my-5" style={styles.root}>
            <div className="text-subtitle py-3 text-white text-center font-weight-bold">
                Seu Fidelidômetro:
            </div>
            {showScore()}
            {showPrizeGalleryBtn()}
        </section>
    );
}
