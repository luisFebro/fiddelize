// IMPORTANT: changes here should be also made in the PLATFORM FOOTER since they are the same.
import { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "hooks/useDelay";
import AsyncVersion from "_main/user-interfaces/version/AsyncVersion";
import ModalFullContent from "components/modals/ModalFullContent";
import { useReadUI } from "global-data/ui";
import "./_Footer.scss";
import { Load } from "../../code-splitting/LoadableComp";

const AsyncFiddelizeContact = Load({
    loader: () =>
        import(
            "../../../pages/dashboard-client-admin/comps/FiddelizeContact" /* webpackChunkName: "fiddelize-contact-modal-lazy" */
        ),
});

const Footer = ({ location }) => {
    const [fullOpen, setFullOpen] = useState(false);
    const versionReady = useDelay(3000);
    const locationNow = location.pathname;

    const { chatBgColor } = useReadUI("global");

    const isSupportPage = locationNow.includes("suporte");
    const supportColor = chatBgColor;
    const fill = getWaveFillColor({ isSupportPage, supportColor });

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const isBlackList =
        locationNow.includes("baixe-app") ||
        locationNow.includes("/t/app") ||
        locationNow.includes("altrabot") ||
        locationNow.includes("cardapio-qr");

    const showAboutColumn = () => (
        <section className="col-md-4">
            <div className="footer-col first text-voca-cyan">
                <h4>Sobre a Fiddelize</h4>
                <p>
                    Ajudamos negócios a oferecer <strong>benefícios</strong>{" "}
                    para seus clientes com <strong>clube de compra</strong>.
                </p>
                <p>
                    No clube, clientes recebem <strong>moedas digitais</strong>{" "}
                    nas compras para troca de benefícios ao concluir a meta de
                    um <strong>jogo de compra</strong>.
                </p>
                <p>
                    Somos uma martech especializada em{" "}
                    <strong>marketing</strong> promocional,{" "}
                    <strong>análise</strong> e <strong>experiência</strong> de
                    compra.
                </p>
            </div>
        </section>
    );

    const showBizLinks = () => (
        <section className="col-md-4">
            <div className="footer-col middle">
                <ul className="list-unstyled li-space-lg p-small">
                    <li className="media">
                        <i className="fas fa-square" />
                        <div className="media-body">
                            <a
                                onClick={() => {
                                    setFullOpen(true);
                                }}
                            >
                                Fale conosco
                            </a>
                        </div>
                    </li>
                    <br />
                    <li className="media">
                        <i className="fas fa-square" />
                        <div className="media-body">
                            <Link to="/termos-de-uso">Termos de uso</Link>
                        </div>
                    </li>
                    <br />
                    <li className="media">
                        <i className="fas fa-square" />
                        <div className="media-body">
                            <Link to="/privacidade">Privacidade</Link>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );

    const showSupportLinks = () => (
        <section className="col-md-4">
            <div className="footer-col last">
                <ul className="list-unstyled li-space-lg p-small">
                    <li className="media">
                        <i className="fas fa-square" />
                        <div className="media-body">
                            <Link to="/acesso/verificacao">Acessar conta</Link>
                        </div>
                    </li>
                    <br />
                    <li className="media">
                        <i className="fas fa-square" />
                        <div className="media-body">
                            <Link to="/status-de-servicos">
                                Status de serviços
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );

    return (
        !isBlackList && (
            <footer>
                {showSvgWave(fill)}
                <div className="container-fluid">
                    <div className="row">
                        {showAboutColumn()}
                        {showBizLinks()}
                        {showSupportLinks()}
                    </div>
                </div>
                <div className="copyright-slogon">
                    {" "}
                    <div className="pt-3 pb-5 pb-md-2 position-relative target-download theme-p-dark text-s text-center text-voca-cyan">
                        <span className="pb-5 pb-md-2 d-inline-block mx-3 font-weight-bold text-small">
                            © 2020-{new Date().getFullYear()} Fiddelize
                            <br />
                            Conquiste clientes no próximo nível.
                            <br />
                            <br />
                            Feito com <FontAwesomeIcon icon="heart" /> em Manaus
                            - Am
                        </span>
                    </div>
                </div>
                {versionReady && (
                    <AsyncVersion position="absolute" bottom={0} left={10} />
                )}
                {fullOpen && (
                    <ModalFullContent
                        contentComp={<AsyncFiddelizeContact />}
                        fullOpen={fullOpen}
                        setFullOpen={handleFullClose}
                        backgroundColor="var(--themeP)"
                    />
                )}
            </footer>
        )
    );
};

// HELPERS
function getWaveFillColor({ isSupportPage, supportColor }) {
    if (isSupportPage && !supportColor) return "var(--mainWhite)"; // default color for the first time user enter in the support or not toggling the dark mode
    if (isSupportPage && supportColor) return supportColor;
    return "var(--themeBackground--default)";
}

function showSvgWave(fill = "var(--themeBackground--default)") {
    return (
        <section className="footer-shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                    fill={fill}
                    d="M 0,112.99894 40,94.165786 C 80,75.332629 160,37.666314 240,37.666314 c 80,0 160,37.666315 240,53.38023 80,15.478506 160,9.593136 240,-3.178095 80,-12.53582 160,-31.368978 240,-18.833157 80,12.771234 160,56.322908 240,56.499468 80,-0.17656 160,-43.728234 200,-65.916047 l 40,-21.952399 V 0 h -40 C 1360,0 1280,0 1200,0 1120,0 1040,0 960,0 880,0 800,0 720,0 640,0 560,0 480,0 400,0 320,0 240,0 160,0 80,0 40,0 H 0 Z"
                    id="path2"
                />
            </svg>
            <style jsx>
                {`
                    /* LESSON: the waves should be as thin as possible to fit the layout without overflowing it. */
                    .footer-shape {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        -webkit-transform: translateY(-5%);
                        transform: translateY(-5%);
                    }
                `}
            </style>
        </section>
    );
}
// END HELPERS

export default withRouter(Footer);

/*
<footer
    style={{ bottom: 0, marginTop: "calc(5% + 60px)" }}
    className=""
>

</footer>
*/

/* COMMENTS
n1:
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;

margin-right stretching the margin and giving a span.
*/
