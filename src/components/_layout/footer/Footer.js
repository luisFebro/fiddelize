// IMPORTANT: changes here should be also made in the PLATFORM FOOTER since they are the same.
import { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "hooks/useDelay";
import AsyncVersion from "_main/user-interfaces/version/AsyncVersion";
import ModalFullContent from "components/modals/ModalFullContent";
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
    const isHome = locationNow === "/";

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const isBlackList =
        locationNow.includes("baixe-app") ||
        locationNow.includes("/t/app") ||
        locationNow.includes("altrabot");

    const showAboutColumn = () => (
        <section className="col-md-4">
            <div className="footer-col first">
                <h4>Sobre a Fiddelize</h4>
                <p className="text-small text-voca-cyan">
                    Ajudamos negócios a oferecer <strong>benefícios</strong>{" "}
                    para seus clientes com{" "}
                    <strong>moeda digital e jogos de compra</strong>. Na nossa
                    plataforma, você monta seu clube e personaliza web apps com
                    sua marca.
                    <br />
                    <br />
                    Somos uma martech especializada em{" "}
                    <strong>
                        marketing de relacionamento e análise de compra
                    </strong>{" "}
                    da clientela.
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
                {isHome && (
                    <div className="shape">
                        <img
                            src="/img/illustrations/home/shapes/landing-footer.svg"
                            alt="shape 1"
                        />
                    </div>
                )}
                <div className={`container ${!isHome ? "theme-p-dark" : ""}`}>
                    <div className="row">
                        {showAboutColumn()}
                        {showBizLinks()}
                        {showSupportLinks()}
                    </div>
                </div>
                <div className="copyright-slogon">
                    {" "}
                    <div className="position-relative target-download theme-p-dark text-s text-center pt-3 text-voca-cyan">
                        <span className="d-inline-block mx-3 font-weight-bold text-small">
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
