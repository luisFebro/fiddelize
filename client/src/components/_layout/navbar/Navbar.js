import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../../redux/actions/authActions';
import { CLIENT_URL } from '../../../config/clientUrl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const isSmall = window.Helper.isSmallScreen();

function Navbar({ history, location }) {
    // const [showSkeleton, setShowSkeleton] = useState(true);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const { isUserAuthenticated, role, _idStaff } = useStoreState(state => ({
       isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
       role: state.userReducer.cases.currentUser.role,
       _idStaff: state.userReducer.cases.currentUser._id,
    }));

    const dispatch = useStoreDispatch();

    const addZoomout = () => {
        const icon = document.getElementById('searchIcon');
        icon.className += ' animated zoomOut slow';
        setTimeout(() => {
            setSearchOpen(true);
        }, 1000);
    };

    const closeBtn = () => {
        const icon = document.getElementById('searchIcon'),
            closeBtn = document.getElementById('closeBtn');
        // searchComplete = document.getElementById("SearchCompleteWithImg");

        closeBtn.className = 'fas fa-times-circle animated rotateOut';
        // searchComplete.className = "animated zoomOut delay-2s";
        icon.className = 'fas fa-search animated zoomIn slow';
        setTimeout(() => {
            setSearchOpen(false);
        }, 1000);
    };

    // Render
    const locationNow = location.pathname;

    const btnLogout = () => (
        <button
            style={{
                position: 'absolute',
                top: '45px',
                right: '5px',
                color: "white",
                padding: '2px 5px',
                borderRadius: '20px',
                backgroundColor: 'var(--themeSDark)',
                outline: "none"
            }}
            onClick={() => logout(dispatch)}
        >
            sair
        </button>
    );

    const titleByRoleHandler = () => (
        <Fragment>
            {!isUserAuthenticated ? (
                <Link
                    to="/acesso/verificacao"
                    className={["/cliente/pontos-fidelidade", "/acesso/verificacao"].includes(locationNow) ? "disabled-link" : "nav-link"}
                >
                    {locationNow === "/"
                    ? (
                        <span className="text-subtitle text-s" style={{position: 'relative', right: isSmall ? '-18px' : '' }}>
                            Acesso <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
                        </span>
                    ) : null}
                </Link>
            ) : (
                <div className="text-white">
                    {role === "admin" &&
                    <Fragment>
                        <Link to="/admin/painel-de-controle">
                            Usuário: Administrador <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
                        </Link>
                        {btnLogout()}
                    </Fragment>}

                    {role === "colaborador" &&
                    <Fragment>
                        <Link to={`/colaborador/quadro-administrativo/${_idStaff}`}>
                            C-Admin <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
                        </Link>
                        {btnLogout()}
                    </Fragment>}

                    {role === "cliente" &&
                        <Fragment>
                            <span className="text-subtitle text-s" style={{position: 'relative', right: isSmall ? '-18px' : '' }}>
                                Cliente <i className="fas fa-lock" style={{fontSize: '1.9rem'}}></i>
                            </span>
                            {btnLogout()}
                        </Fragment>
                    }
                </div>
            )}
        </Fragment>
    );

    const showManagingBtn = () => (
        <ul className="animated zoomIn slow navbar-nav ml-3 ml-sm-auto mr-3 align-items-center">
            <li
                className="nav-item text-subtitle"
                style={{color: "black"}}
            >
                {titleByRoleHandler()}
            </li>
        </ul>
    );

    const showLogo = () => (
        <Link to="/">
            <img
                className="animated zoomIn slow"
                style={{position: 'absolute', top: '10px', left: isSmall ? '5px' : '20px'}}
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
            {showManagingBtn()}
        </NavWrapper>
    );
}

export default withRouter(Navbar); // n1

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
    #searchIcon {
        cursor: pointer;
        z-index: 1200;
    }
    #closeBtn {
        position: fixed;
        cursor: pointer;
        font-size: 1.7em;
        top: 5rem;
        right: 5%;
        color: var(--mainWhite);
        z-index: 1500;
        filter: drop-shadow(0.001em 0.1em 0.1em var(--mainDark));
    }
    & .fixed {
        position: fixed;
        right: 1.2rem;
        top: 1.9rem;
    }
    #searchIcon {
        font-size: 2.1rem;
        filter: drop-shadow(0.001em 0.1em 0.1em var(--mainDark));
    }
    .nav-link,
    #searchIcon {
        text-transform: capitalize;
    }

    & .nav-link:hover:hover,
    #searchIcon:hover {
        transform: scale(1.1);
        filter: drop-shadow(0.001em 0.2em 0.1em var(--mainTheme));
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