import { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { useBizData } from "init";
import useDelay from "../../../../hooks/useDelay";
import TypesHandler from "./types-handler/TypesHandler";
import useAuth from "auth/useAuth";
import removeImgFormat from "../../../../utils/biz/removeImgFormat";

const getStyles = () => ({
    clipPathBack: {
        position: "absolute",
        background: "var(--themeP)",
        clipPath: "circle(77.5% at 23% 0)",
        webPackClipPath: "circle(77.5% at 23% 0)",
        padding: "250px",
    },
});

export default withRouter(RegistersPanel);

function RegistersPanel({ history, isNewMember = false }) {
    const { bizLogo, bizLinkName } = useBizData();
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);
    useAuth({ history, roles: "cliente-membro, cliente-admin" });

    const styles = getStyles();

    const readyTypesHandler = useDelay(1500);

    const showHeader = () => (
        <Fragment>
            <div style={styles.clipPathBack} />
            <div className="position-relative container-center-col my-3">
                <img
                    src={thisBizLogo}
                    width={width}
                    height={height}
                    alt="logo"
                />
                <p className="mt-3 text-shadow animated fadeInUp text-title text-white text-center">
                    {isNewMember ? "Novo Membro Equipe" : "Novo Cliente"}
                </p>
            </div>
        </Fragment>
    );

    const showSharerPageLink = () =>
        readyTypesHandler &&
        !isNewMember && (
            <section className="my-3 text-right mr-3">
                <Link
                    to={`/${bizLinkName}/compartilhar-app`}
                    className="text-link text-small"
                >
                    Mais opções de divulgação
                </Link>
            </section>
        );

    const showTypesHandler = () =>
        readyTypesHandler && (
            <section className="my-5">
                <TypesHandler isNewMember={isNewMember} />
            </section>
        );

    return (
        <section>
            {showHeader()}
            {showTypesHandler()}
            {showSharerPageLink()}
        </section>
    );
}
