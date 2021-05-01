import { Fragment, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import styled from "styled-components";

import gaEvent from "../../../utils/analytics/gaEvent";
import RadiusBtn from "../../buttons/RadiusBtn";
import isThisApp from "../../../utils/window/isThisApp";
import "./NavbarLayout.scss";
import { useAuthUser } from "../../../hooks/useAuthUser";
import useImg, { Img } from "../../../hooks/media/useImg";
import removeImgFormat from "../../../utils/biz/removeImgFormat";
import { getNewAppPage } from "../../../pages/new-app/helpers/handleRedirectPages";
// import useCount from '../../../hooks/useCount';

// const gotToken = localStorage.getItem("token");
const isApp = isThisApp();
const isSmall = window.Helper.isSmallScreen();

function Navbar({ history, location }) {
    const [url, setUrl] = useState({
        logoBiz: "",
        logoFid: "",
    });

    const logoBiz = useImg(url.logoBiz, {
        trigger: url.logoBiz,
        coll: "logos",
        key: "app_biz_logo",
    });
    const logoFid = useImg(url.logoFid, {
        trigger: url.logoFid,
        coll: "logos",
        key: "app_fiddelize_logo",
    });
    const logoSrc = logoBiz || logoFid;

    const { isAuthUser } = useAuthUser();
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
        locationNow.includes("status-de-servicos");

    const showAccessBtn = () => (
        <Link
            to="/acesso/verificacao"
            className={
                ["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(
                    locationNow
                )
                    ? "disabled-link"
                    : "nav-link"
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

    // const forceFiddelizeLogo = locationNow.indexOf('temporariamente-indisponivel-503') >= 0
    const needClientLogo =
        (isAdminDash && bizLogo) || (isAuthUser && bizLogo && isApp); // isApp &&
    const fiddelizeLogo = "/img/official-logo-name.png";
    const handleLogoSrc = () => {
        if (needClientLogo) {
            const { newImg: thisbizLogo } = removeImgFormat(bizLogo);
            return setUrl({ ...url, logoBiz: thisbizLogo });
        }
        return setUrl({ ...url, logoFid: fiddelizeLogo });
    };

    useEffect(() => {
        handleLogoSrc();
    }, [needClientLogo]);

    const showLogo = () => {
        const imgFormatRaw = bizLogo && bizLogo.includes("h_100,w_100");
        const webCond = locationNow !== "/" && isAdminDash && imgFormatRaw;

        const appCond = isApp && imgFormatRaw;

        const isSquared = webCond || appCond;
        // gotArrayThisItem(["/cliente-admin/painel-de-controle", ], locationNow)
        const handleSize = (side) => {
            let size;
            if (side === "width") {
                if (bizLogo) {
                    isSquared ? (size = 85) : (size = 150);
                } else {
                    size = 200;
                }
            } else if (bizLogo) {
                isSquared ? (size = 85) : (size = 67);
            } else {
                size = 90;
            }
            return size;
        };

        const handleLogoClick = () => {
            if (isClientAdmin && locationNow.includes("pontos-fidelidade"))
                return "/mobile-app?client-admin=1";
            return isApp ? "/mobile-app" : "/";
        };
        return (
            <Link to={handleLogoClick()}>
                <Img
                    style={{
                        position: "absolute",
                        top: needClientLogo ? 0 : "8px",
                        left: isSmall ? "10px" : "20px",
                    }}
                    src={locationNow === "/" ? fiddelizeLogo : logoSrc}
                    alt="Logomarca Principal"
                    width={handleSize("width")}
                    height={handleSize("height")}
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
                    ? "disabled-link"
                    : "nav-link"
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
            <NavWrapper
                className="navbar navbar-expand-sm text-nav-items"
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
            </NavWrapper>
        )
    );
}

export default withRouter(Navbar); // n1

/* ARCHIVES
{locationNow.includes("/cliente-admin/painel-de-controle") && btnLogout()}

{isSmall ? "Admin" : "Usuário: Cliente-Admin"} <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>

This is not wokring right... I cant seem to log out when clicked i the btn.
<div>
    <span className="text-subtitle text-s" style={{position: 'relative', right: isSmall ? '-18px' : '' }}>
        Cliente <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
    </span>
    {btnLogout()}
</div>

{role === "colaborador" &&
<Fragment>
    <Link to={`/colaborador/quadro-administrativo/${_idStaff}`}>
        Usuário: Colaborador <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
    </Link>
    {btnLogout()}
</Fragment>}
*/

// STYLES
const DivWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 1010;
`;
const NavWrapper = styled.nav`
    & {
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
    & .fixed {
        position: fixed;
        right: 1.2rem;
        top: 1.9rem;
    }

    .nav-link {
        text-transform: capitalize;
    }
`;

/* ARCHIVES
import KeyAccessDashboard from './KeyAccessDashboard';
const showKeyAccessDashboard = () => (
    <Link to="/painel-controle-admin">
        <KeyAccessDashboard />
    </Link>
);

import { storeIcon } from './dataIcons';
import { dataWorkingHour } from './working-hour/GetWorkingHour';
const isStoreOpen = dataWorkingHour[1];

import ShowImgOrSkeleton from '../../ShowImgOrSkeleton';
import CategorySlider from './CategorySlider';
import SearchCompleteWithImg from '../../SearchCompleteWithImg';
*/

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
