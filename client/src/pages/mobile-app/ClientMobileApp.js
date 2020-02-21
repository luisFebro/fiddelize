import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../redux/actions/authActions';
import { showComponent } from '../../redux/actions/componentActions';
import SpeedDialButton from '../../components/buttons/SpeedDialButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import Tilt from 'react-tilt'
// import Login from '../../components/auth/Login';
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
// import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
// SpeedDial and Icons
// import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
// End SpeedDial and Incons

function ClientMobileApp({ history }) {
    const [showMoreBtn, setShowMoreBtn] = useState(false);

    let { isUserAuth, role, loyaltyScores, userName } = useStoreState(state => ({
        isUserAuth: state.authReducer.cases.isUserAuthenticated,
        role: state.userReducer.cases.currentUser.role,
        userName: state.userReducer.cases.currentUser.name,
    }))

    const dispatch = useStoreDispatch();

    const playBeep = () => {
        // Not working
        const elem = document.querySelector("#appBtn");
        elem.play();
    }

    const showMoreOptionsBtn = () => {
        const speedDial = {
            actions: [
                //the order rendered is inverse from the bottom to top
                {
                    icon: <ExitToAppIcon />,
                    name: 'Desconectar',
                    backColor: 'var(--mainPink)',
                    onClick: () => {
                        logout(dispatch);
                        playBeep();
                    }
                },
                {
                    icon: <LoyaltyIcon />,
                    name: 'Adicionar Pontos',
                    backColor: 'var(--mainPink)',
                    onClick: () => {
                        showComponent(dispatch, "purchaseValue");
                        history.push("/cliente/pontos-fidelidade");
                        playBeep();
                    },
                },
            ]
        }

        return(
            <SpeedDialButton
                actions={speedDial.actions}
                tooltipOpen={true}
                size="large"
                FabProps={{
                    backgroundColor: 'var(--mainPink)',
                    size: 'medium',
                }}
                root={{
                    bottom: '30px',
                    right: '40px',
                }}
                hidden={!showMoreBtn}
            />
        );
    }

    return (
        <div>
            <div className="margin-auto-90">
                <img src="/img/logo.svg" alt="logo" width={300} height={300}/>
            </div>
            <section>
                {isUserAuth && role === "cliente"
                ? (
                    <Fragment>
                        <br/>
                        <br/>
                        Hello, I am the app
                        <audio id="appBtn" src="https://ia601500.us.archive.org/29/items/confirmation-keypad-sound/confirmation-keypad-sound.wav"></audio>
                    </Fragment>
                ) : null}
            </section>
        </div>
    );
}

export default withRouter(ClientMobileApp);

/*
{loading
? (
    <LoadingThreeDots color="white" />
) : (

)}
 */

/*
<div className="my-3 container-center">
    <img src="/img/official-logo.jpg" alt="logo" width={300} height="auto"/>
</div>
 */