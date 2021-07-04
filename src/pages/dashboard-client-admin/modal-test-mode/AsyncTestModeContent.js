import { Link } from "react-router-dom";
import Img from "../../../components/Img";

const getStyles = () => ({
    rootCard: {
        background: "var(--themeP)",
        width: "150px",
        height: "auto",
        borderRadius: "20px",
    },
});

export default function AsyncTestModeContent() {
    const styles = getStyles();

    const showClientCard = () => (
        <Link className="no-text-decoration" to="/mobile-app?client-admin=1">
            <section className="shadow-babadoo" style={styles.rootCard}>
                <Img
                    className="mx-5 mt-5 mb-3"
                    src="/img/icons/test-mode/clients-test.svg"
                    offline
                    width="120px"
                    height="auto"
                    alt="teste app clientes"
                />
                <div className="pb-3 text-nowrap text-center text-normal text-white font-weight-bold">
                    App
                    <br />
                    Cliente
                </div>
            </section>
        </Link>
    );

    const showTeamCard = () => (
        <Link className="no-text-decoration" to="/t/app/equipe?modo-prev=1">
            <section className="shadow-babadoo" style={styles.rootCard}>
                <Img
                    className="mx-5 mt-5 mb-3"
                    src="/img/icons/test-mode/members-test.svg"
                    offline
                    width="120px"
                    height="auto"
                    alt="teste app membros"
                />
                <div className="pb-3 text-nowrap text-center text-normal text-white font-weight-bold">
                    App
                    <br />
                    Equipe
                </div>
            </section>
        </Link>
    );

    return (
        <section style={{ marginTop: 100 }}>
            <h1 className="mb-5 mx-3 text-subtitle text-purple text-center font-weight-bold">
                Escolha e veja como fica outros apps disponíveis para seu
                negócio
            </h1>
            <section className="mt-3 animated fadeInUp container-center">
                <div className="mr-3">{showClientCard()}</div>
                {showTeamCard()}
            </section>
        </section>
    );
}
