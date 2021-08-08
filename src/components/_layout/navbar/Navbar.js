import { Fragment, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import useAuth from "auth/useAuth";
import gaEvent from "utils/analytics/gaEvent";
import isThisApp from "utils/window/isThisApp";
import "./NavbarLayout.scss";
import removeImgFormat from "utils/biz/removeImgFormat";
import { getNewAppPage } from "pages/new-app/helpers/handleRedirectPages";
import RadiusBtn from "../../buttons/RadiusBtn";

const isApp = isThisApp();
const isSmall = window.Helper.isSmallScreen();

function Navbar({ history, location }) {
    const [url] = useState({
        logoBiz: "",
        logoFid: "",
    });

    const isAuth = useAuth();
    const { bizLogo, themePColor } = useBizData();

    // const dispatch = useStoreDispatch();

    // Render
    const locationNow = location.pathname;
    const isHome = locationNow === "/" || locationNow.includes("/de/");
    const isAdminDash = locationNow.includes(
        "cliente-admin/painel-de-controle"
    );
    const isClientAdmin = location.search.includes("client-admin=1");
    // const isBizTeam = locationNow.includes("nucleo");

    const isBlackList =
        locationNow.includes("baixe-app") ||
        locationNow.includes("planos") ||
        locationNow.includes("pedidos") ||
        locationNow.includes("conserte-data") ||
        locationNow.includes("senha-de-acesso") ||
        locationNow.includes("nova-senha") ||
        locationNow.includes("equipe") ||
        locationNow.includes("cartao-virtual") ||
        locationNow.includes("senha-equipe") ||
        locationNow.includes("pix") ||
        locationNow.includes("painel-de-apps") ||
        locationNow.includes("playground") ||
        locationNow.includes("status-de-servicos") ||
        locationNow.includes("codigo") ||
        locationNow.includes("altrabot");

    const showAccessBtn = () => (
        <Link
            to="/acesso/verificacao"
            className={
                ["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(
                    locationNow
                )
                    ? "disabled-link no-text-decoration"
                    : "nav-link no-text-decoration"
            }
        >
            {isHome ? (
                <span
                    className="text-subtitle text-s"
                    style={{
                        position: "relative",
                        right: isSmall ? "-18px" : "40px",
                    }}
                >
                    Acesso{" "}
                    <FontAwesomeIcon
                        icon="lock"
                        style={{ fontSize: "1.9rem" }}
                    />
                </span>
            ) : null}
        </Link>
    );

    const showCallToActionBtn = () => {
        const handleRedirect = async () => {
            const newAppLink = await getNewAppPage();
            gaEvent({
                label: "Navbar",
                category: "Fixed Navegation Bar",
                action: "create cli-admin app",
            });
            history.push(newAppLink);
        };

        return (
            <Fragment>
                {isHome && (
                    <RadiusBtn
                        title={isSmall ? "Crie App" : "Crie seu App"}
                        position="fixed"
                        onClick={handleRedirect}
                        top={10}
                        right={10}
                        zIndex={1000}
                    />
                )}
            </Fragment>
        );
    };

    const showButtons = () => (
        <Fragment>
            <ul
                className="nav-item-position navbar-nav mr-3 align-items-center"
                style={{
                    display: [
                        "/baixe-app/",
                        "/regulamento",
                        "/cliente/pontos-fidelidade",
                        "/compartilhar-app",
                    ].some((link) => locationNow.includes(link))
                        ? "none"
                        : "block",
                }}
            >
                <li className="nav-item text-subtitle">
                    <span>{showAccessBtn()}</span>
                </li>
            </ul>
            {showCallToActionBtn()}
        </Fragment>
    );

    const showLogo = () => {
        // const forceFiddelizeLogo = locationNow.indexOf('temporariamente-indisponivel-503') >= 0
        const needClientLogo =
            (isAdminDash && bizLogo) || (isAuth && bizLogo && isApp); // isApp &&
        const fiddelizeLogo = "/img/official-logo-name.png";
        const { newImg: thisbizLogo, width, height } = removeImgFormat(
            needClientLogo && bizLogo
        );

        // const webCond = locationNow !== "/" && isAdminDash && imgFormatRaw;
        // const appCond = isApp && imgFormatRaw;

        const handleLogoClick = () => {
            if (isClientAdmin && locationNow.includes("pontos-fidelidade"))
                return "/mobile-app?client-admin=1";
            return isApp ? "/mobile-app" : "/";
        };

        const logoSrc =
            locationNow === "/" || !needClientLogo
                ? fiddelizeLogo
                : thisbizLogo;

        return (
            <Link to={handleLogoClick()}>
                <img
                    style={{
                        position: "absolute",
                        top: needClientLogo ? 0 : "8px",
                        left: isSmall ? "10px" : "20px",
                    }}
                    src={logoSrc}
                    alt="Logomarca Principal"
                    width={!needClientLogo ? 160 : width}
                    height={!needClientLogo ? 70 : 90}
                />
            </Link>
        );
    };

    const showAccessLinkMobile = () => (
        <Link
            to="/acesso/verificacao"
            className={`access-link-mobile ${
                ["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(
                    locationNow
                )
                    ? "disabled-link no-text-decoration"
                    : "nav-link no-text-decoration"
            }`}
        >
            {isHome ? (
                <span className="text-normal text-s">
                    Acesso{" "}
                    <FontAwesomeIcon
                        icon="lock"
                        style={{ fontSize: "1.4rem" }}
                    />
                </span>
            ) : null}
        </Link>
    );

    return (
        !isBlackList && (
            <section
                className="root navbar shadow-babadoo navbar-expand-sm text-nav-items"
                style={{
                    backgroundColor:
                        !isApp || locationNow.includes("/painel-de-controle")
                            ? "var(--themePDark--default)"
                            : `var(--themePDark--${themePColor})`,
                }}
            >
                {showLogo()}
                {showButtons()}
                {showAccessLinkMobile()}
                <style jsx global>
                    {`
                        .root {
                            margin: 0;
                            padding: 0;
                            min-height: 50px;
                        }

                        .store-container {
                            position: relative;
                        }

                        .store-badge {
                            font-size: 0.4em;
                            position: absolute;
                            top: 60%;
                            left: 65%;
                            transform: translate(-50%, -50%);
                        }
                        .fixed {
                            position: fixed;
                            right: 1.2rem;
                            top: 1.9rem;
                        }

                        .nav-link {
                            text-transform: capitalize;
                        }
                    `}
                </style>
            </section>
        )
    );
}

export default withRouter(Navbar); // n1

/* COMMENTS
n1: withRouter - https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom
When you include a main page component in your app, it is often wrapped in a <Route> component like this:

<Route path="/movies" component={MoviesIndex} />
By doing this, the MoviesIndex component has access to this.props.history so it can redirect the user with this.props.history.push.

Some components (commonly a header component) appear on every page, so are not wrapped in a <Route>:

render() {
  return (<Header />);
}
This means the header cannot redirect the user.

To get around this problem, the header component can be wrapped in a withRouter function, either when it is exported:

export default withRouter(Header)
*/
