import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../../redux/actions/authActions';
import { CLIENT_URL } from '../../../config/clientUrl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isThisApp from '../../../utils/window/isThisApp';
import './NavbarLayout.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from '../../../hooks/useRoleData';

const isSmall = window.Helper.isSmallScreen();
const gotToken = localStorage.getItem("token");

function Navbar({ history, location }) {
    // const [showSkeleton, setShowSkeleton] = useState(true);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const { isUserAuthenticated, role, _idStaff } = useStoreState(state => ({
       isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
       role: state.userReducer.cases.currentUser.role,
       _idStaff: state.userReducer.cases.currentUser._id,
    }));

    const { bizCodeName } = useClientAdmin();

    const dispatch = useStoreDispatch();

    // Render
    const locationNow = location.pathname;

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

    const titleByRoleHandler = () => (
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

    const showRoleTitles = () => (
        <ul
            className="navbar-nav ml-3 ml-sm-auto mr-3 align-items-center"
            style={{ display: ["/baixe-app/",].some(link => locationNow.includes(link)) ? "none" : "block" }}
        >
            <li
                className="nav-item text-subtitle"
            >
                {titleByRoleHandler()}
            </li>
        </ul>
    );

    const showLogo = () => (
        <Link to={isThisApp() ? "/mobile-app" : "/"}>
            <img
                className="animated zoomIn slow"
                style={{position: 'absolute', top: '12px', left: isSmall ? '5px' : '20px'}}
                src={CLIENT_URL + "/img/official-logo-name.png"}
                alt="Logomarca Principal"
                width="200px"
                height="70px"
            />
        </Link>
    );

    // Render
    return (
        <NavWrapper
            className="navbar navbar-expand-sm text-nav-items theme-p-dark"
        >
            {showLogo()}
            {showRoleTitles()}
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