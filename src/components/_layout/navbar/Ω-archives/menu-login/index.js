import React, { Fragment, useEffect } from 'react';
import NotifDropDown from './notification/NotifDropDown';
import Badge from '@material-ui/core/Badge';
// import { withStyles } from '@material-ui/core/styles';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../../../redux/actions/authActions';
// End Redux
// Utils
import isRealObj from '../../../../utils/isRealObj';
import truncateWords from '../../../../utils/string/truncateWords';
// End Utils
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import { bizWhatsapp } from '../../../../data/dataBiz';

// const BorderedBadge = withStyles(theme => ({
//     badge: {
//         right: 1,
//         top: 7,
//         border: `2px solid var(--mainDark)`,
//         // padding: '0 4px',
//         backgroundColor: 'var(--mainRed)'
//     }
// }))(Badge);

export default function MenuLogin() {
    // Redux
    const { isUserAuthenticated, currUser } = useStoreState(state => ({
        isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
        currUser: state.userReducer.cases.currentUser,
    }));
    const { name, picture } = currUser; //favoriteList

    const dispatch = useStoreDispatch();
    // End Redux
    const animateZoomOut = () => {
        //NOT WORKING
        const mainNav = document.querySelector('#mainNav');

        mainNav.classList.add('animated', 'zoomOut', 'slow');
        mainNav.style.animationDelay = '0s';
    };
    const changeCss = () => {
        const navElement = document.querySelector('#mainNav');
        const logo = document.querySelector('#logo-login-wrapper');
        const logoImg = document.querySelector('#logo-login-img');
        if (isRealObj(navElement)) {
            if (window.scrollY > 50) {
                //transition and animaiton not working at all
                navElement.className += ' shadow-elevation-soft';
                logo.style.transition = '3s';
                logoImg.className += 'animated slideOutLeft slow';
                logo.style.display = 'block';
            }
            if (window.scrollY < 50) {
                logo.style.transition = '3s';
                logoImg.className += 'animated slideOutLeft slow';
                logo.style.display = 'none';
            }
        }
    };

    useEffect(() => window.addEventListener('scroll', changeCss, true), []);

    return (
        <Fragment>
            {isUserAuthenticated ? (
                <DivWrapper id="mainNav" className="animated zoomIn slower">
                    <nav className="navbar navbar-expand-sm px-sm-3 text-nav-items py-0 my-0">
                        <Link to="/" className="px-1" id="logo-login-wrapper" style={{ display: 'none' }}>
                            <img
                                id="logo-login-img"
                                src="img/official-logo.jpg"
                                alt="Logomarca da Studio Love Beauty"
                                width="120rem"
                                height="50rem"
                                className="navbar-brand"
                            />
                        </Link>
                        <ul className="navbar-nav container-ul">
                            <li className="nav-item">
                                <Link to="/perfil" className="nav-link">
                                    {isUserAuthenticated ? (
                                        picture ? (
                                            <img
                                                className="profilePic nav-brand"
                                                src={picture}
                                                alt={name}
                                                title={name}
                                            />
                                        ) : null
                                    ) : (
                                        <img
                                            className="profilePic"
                                            src="img/icons/avatar-woman.png"
                                            alt="avatar babadoo"
                                        />
                                    )}
                                </Link>
                                <p className="user-name-greeting badge badge-warning">
                                    {name
                                        ? `Olá, ${truncateWords(name.cap(), 12)}`
                                        : 'Olá, ...'}
                                </p>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-3">
                            <li className="nav-item">
                                <div className="nav-link">
                                    <span>
                                        <NotifDropDown />
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <button
                                    style={{ cursor: 'pointer', padding: '0 4px', border: 'none' }}
                                    className="logout-btn badge badge-danger"
                                    onClick={() => {
                                        animateZoomOut();
                                        logout(dispatch);
                                    }}
                                >
                                    SAIR
                                </button>
                            </li>
                        </ul>
                    </nav>
                </DivWrapper>
            ) : null}
        </Fragment>
    );
}

const DivWrapper = styled.div`
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
    max-height: 55px;
    //line-height: 30px;

    i {
        font-size: 2.5rem;
    }

    p,
    nav,
    span,
    i {
        padding: 0;
        color: var(--mainWhite);
    }

    p,
    nav,
    span {
        font: normal 1rem 'Cabin', sans-serif;
    }

    .profilePic {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
    }

    .container-ui {
        position: relative;
    }

    .user-name-greeting {
        color: var(--mainDark);
        padding: 0 3px;
        position: absolute;
        font: normal 1rem 'Cabin', sans-serif;
        top: 3.5rem;
    }

    .logout-btn {
        background: var(--mainRed);
        position: absolute;
        font: normal 1rem 'Cabin', sans-serif;
        top: 1px;
        right: 4px;
        padding: 0 3px;
    }

    & .nav-link:hover,
    & .navbar-nav span i:hover {
        transform: scale(1.1);
        filter: drop-shadow(0.001em 0.1em 0.1em var(--mainDark));
    }

    /*MOBILE FIRST RESPONSIVE MEDIA QUERIES*/
    /*media portrait tablets and large phones || for large devices, use min-width: 992px and up*/
    @media only screen and (min-width: 600px) {
        .logout-btn {
            top: 4px;
            font: normal 1.2rem 'Cabin', sans-serif;
            padding: 5px 8px;
        }
        i {
            //font-size: 1.9rem;
        }
        .user-name-greeting {
            font: normal 1.1rem 'Cabin', sans-serif;
            padding: 2px 5px;
            //top: 3.4rem;
        }
    }
`;
