import React from "react";
import { withRouter } from "react-router-dom";
import useDelay from "../../../hooks/useDelay";
import AsyncVersion from "../../../_main-app/user-interfaces/version/AsyncVersion";
import "./_Footer.scss";

const Footer = ({ location }) => {
    const versionReady = useDelay(3000);
    const locationNow = location.pathname;
    const isBlackList =
        locationNow.includes("baixe-app") || locationNow.includes("/t/app");

    const showAboutColumn = () => (
        <section className="col-md-4">
            <div className="footer-col first">
                <h4>Sobre a Fiddelize</h4>
                <p className="text-small text-voca-cyan">
                    Somos a{" "}
                    <strong>
                        primeira plataforma de criação de apps web de fidelidade
                    </strong>{" "}
                    e ajudamos negócios a conquistar seus clientes com
                    tecnologia.
                </p>
            </div>
        </section>
    );

    const showImportantLinks = () => (
        <section className="col-md-4">
            <div className="footer-col middle">
                <ul className="list-unstyled li-space-lg p-small">
                    <li className="media">
                        <i className="fas fa-square"></i>
                        <div className="media-body">
                            <a href="">Acessar conta</a>
                        </div>
                    </li>
                    <br />
                    <li className="media">
                        <i className="fas fa-square"></i>
                        <div className="media-body">
                            <a href="">Termos e Condições</a>
                        </div>
                    </li>
                    <br />
                    <li className="media">
                        <i className="fas fa-square"></i>
                        <div className="media-body">
                            <a href="">Política de Privacidade</a>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );

    const showContact = () => (
        <section className="col-md-4">
            <div className="footer-col last">
                <ul className="list-unstyled li-space-lg p-small">
                    <li className="media">
                        <i className="fas fa-square"></i>
                        <div className="media-body">
                            <a href="">Contato</a>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );

    return (
        !isBlackList && (
            <footer>
                <div className="shape">
                    <img
                        src="/img/illustrations/home/shapes/landing-footer.svg"
                        alt="shape 1"
                    />
                </div>
                <div className="container">
                    <div className="row">
                        {showAboutColumn()}
                        {showImportantLinks()}
                        {showContact()}
                    </div>
                </div>
                <div className="copyright-slogon">
                    {" "}
                    <div className="position-relative target-download theme-p-dark text-s text-center pt-3">
                        <strong style={{ fontSize: "24px" }}>Fiddelize</strong>
                        <span className="font-weight-bold text-small">
                            <br />
                            © O próximo nível em pontos de fidelidade. Todos os
                            direitos reservados.
                            <br />
                            Manaus - {new Date().getFullYear()}
                        </span>
                    </div>
                </div>
                {versionReady && (
                    <AsyncVersion position="absolute" bottom={0} left={10} />
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
