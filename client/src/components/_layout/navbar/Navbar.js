import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../../redux/actions/authActions';
import { CLIENT_URL } from '../../../config/clientUrl';
import { Link } from 'react-router-dom';
import RadiusBtn from '../../../components/buttons/RadiusBtn';
import styled from 'styled-components';
import isThisApp from '../../../utils/window/isThisApp';
import './NavbarLayout.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from '../../../hooks/useRoleData';
import gotArrayThisItem from '../../../utils/arrays/gotArrayThisItem';
import { useAuthUser } from '../../../hooks/useAuthUser';
import imgLib, { ImgLoader } from '../../../utils/storage/lForageStore';
// import useImg from '../../../hooks/media/useImg';
// import useCount from '../../../hooks/useCount';

const gotToken = localStorage.getItem("token");
const isApp = isThisApp();

function Navbar({ history, location }) {
    // const srcTest = useImg("/img/illustrations/sms-scheduling.svg", { key: "sms-scheduling"})

    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);
    //RT = 2 (OK);
    // useCount();
    // const [showSkeleton, setShowSkeleton] = useState(true);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const {  role, _idStaff } = useStoreState(state => ({
       role: state.userReducer.cases.currentUser.role,
       _idStaff: state.userReducer.cases.currentUser._id,
    }));

    const { isAuthUser } = useAuthUser();
    const { bizCodeName, selfBizLogoImg, selfThemePColor } = useClientAdmin();

    const dispatch = useStoreDispatch();

    // Render
    const locationNow = location.pathname;
    const isClientAdmin = location.search.includes("client-admin=1");

    const btnLogout = () => (
        <button
            className="font-weight-bold text-small text-shadow"
            style={{
                position: 'absolute',
                top: '65px',
                right: '5px',
                color: "white",
                padding: '2px 5px',
                borderRadius: '20px',
                backgroundColor: 'var(--themeSDark)',
                outline: "none",
            }}
            onClick={() => logout(dispatch)}
        >
            sair
        </button>
    );

    const showAccessBtn = () => (
        <Fragment>
            {!gotToken || !role ? (
                <Link
                    to="/acesso/verificacao"
                    className={["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(locationNow) ? "disabled-link" : "nav-link"}
                >
                    {locationNow === "/"
                    ? (
                        <span className="text-subtitle text-s" style={{position: 'relative', right: isSmall ? '-18px' : '' }}>
                            Acesso <FontAwesomeIcon icon="lock" style={{fontSize: '1.9rem'}} />
                        </span>
                    ) : null}
                </Link>
            ) : (
                <div>
                    {role === "admin" &&
                    <Fragment>
                        <Link to="/admin/painel-de-controle" className="text-cyan-light">
                            Admin <FontAwesomeIcon icon="lock" style={{fontSize: '1.9rem'}} />
                        </Link>
                        {btnLogout()}
                    </Fragment>}

                    {role === "cliente-admin" && // logout and actionbtns moved to DashboardClientAdmin.js
                    <Fragment>
                        <Link
                            to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                            style={{ display: !locationNow.includes("/cliente-admin/painel-de-controle") ? "block" : "none"}}
                            className="text-cyan-light"
                        >
                            Cli-Admin <FontAwesomeIcon icon="lock" style={{fontSize: '1.9rem'}} />
                        </Link>
                    </Fragment>}

                    {role === "cliente" &&
                        <Fragment>
                            <span className="text-cyan-light">Cliente</span>
                            {btnLogout()}
                        </Fragment>
                    }
                </div>
            )}
        </Fragment>
    );

    const showCallToActionBtn = () => (
        locationNow === "/" &&
        <Link
            to="/empresa-teste/novo-app/self-service/5ed0316700c6a10017f8c190?teste=1&nome-cliente=visitante&ponto-premio=500&ponto-atual=100"
            className={["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(locationNow) ? "disabled-link" : "nav-link"}
        >
            <RadiusBtn
                title={isSmall ? "Crie App" : "Crie seu App"}
                position="fixed"
                top={20}
                right={20}
                zIndex={1000}
            />
        </Link>
    );

    const showButtons = () => (
        <Fragment>
            <ul
                className="nav-item-position navbar-nav mr-3 align-items-center"
                style={{ display: ["/baixe-app/", "/regulamento", "/cliente/pontos-fidelidade", "/compartilhar-app"].some(link => locationNow.includes(link)) ? "none" : "block" }}
            >
                <li
                    className="nav-item text-subtitle"
                >
                    <span>
                        {showAccessBtn()}
                    </span>
                </li>
            </ul>
            {showCallToActionBtn()}
        </Fragment>
    );

    // const forceFiddelizeLogo = locationNow.indexOf('temporariamente-indisponivel-503') >= 0
    const needClientLogo = (isApp && selfBizLogoImg) || (isAuthUser && selfBizLogoImg && isApp);
    const fiddelizeLogo = `${CLIENT_URL}/img/official-logo-name.png`;
    const handleLogoSrc = () => {
        if(needClientLogo) {
            return imgLib.app_biz_logo(selfBizLogoImg);
        } else {
            return fiddelizeLogo;
        }
    };
    const src = React.useCallback(() => handleLogoSrc(), [needClientLogo]);

    const showLogo = () => {
        const isSquared = isApp && selfBizLogoImg && selfBizLogoImg.includes("h_100,w_100");
        // gotArrayThisItem(["/cliente-admin/painel-de-controle", ], locationNow)
        const handleSize = side => {
            let size;
            if(side === "width") {
                if(selfBizLogoImg) {
                    isSquared  ? size = 85 : size = 150;
                } else { size = 200; }
            } else {
                if(selfBizLogoImg) {
                    isSquared  ? size = 85 : size = 67;
                } else { size = 90; }
            }
            return size;
        }

        const handleLogoClick = () => {
            if(isClientAdmin && locationNow.includes("pontos-fidelidade")) return "/mobile-app?client-admin=1";
            return isApp ? "/mobile-app" : "/";
        }
        return(
            <Link to={handleLogoClick()}>
                <ImgLoader
                    className={`${needClientLogo ? "app_biz_logo" : "app_fiddelize_logo"} animated zoomIn slow`}
                    style={{position: 'absolute', top: isAuthUser ? 0 : '12px', left: isSmall ? '10px' : '20px'}}
                    src={locationNow === "/" ? fiddelizeLogo : src()}
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
            className={`access-link-mobile ${["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(locationNow) ? "disabled-link" : "nav-link"}`}
        >
            {locationNow === "/"
            ? (
                <span className="text-normal text-s">
                    Acesso <FontAwesomeIcon icon="lock" style={{fontSize: '1.4rem'}} />
                </span>
            ) : null}
        </Link>
    );

    return (
        <NavWrapper
            className="navbar navbar-expand-sm text-nav-items"
            style={{backgroundColor: (!isApp || locationNow.includes("/painel-de-controle")) ? "var(--themePDark--default)" : "var(--themePDark--" + selfThemePColor + ")" }}
        >
            {showLogo()}
            {showButtons()}
            {showAccessLinkMobile()}
        </NavWrapper>
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
        min-height: 60px;
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


/*ARCHIVES
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