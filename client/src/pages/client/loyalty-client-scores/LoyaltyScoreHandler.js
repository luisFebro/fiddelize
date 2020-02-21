import React, { Fragment, useState } from 'react';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import isThisApp from '../../../utils/window/isThisApp';
import PurchaseValue from './PurchaseValue';
import StaffConfirmation from './StaffConfirmation';
import ClientScoresPanel from './ClientScoresPanel';
import HomeButton from '../../../components/buttons/HomeButton';
import { showComponent } from "../../../redux/actions/componentActions";
import { logout } from "../../../redux/actions/authActions";
import { Link } from 'react-router-dom';
import { setRun } from '../../../redux/actions/globalActions';

export default function LoyaltyScoreHandler() {
    const [valuePaid, setValuePaid]  = useState("0");
    const [verification, setVerification]  = useState(false);

    const dispatch = useStoreDispatch();

    const {
        currentComp,
    } = useStoreState(state => ({
        currentComp: state.componentReducer.cases.currentComp,
    }))

    let purchaseValue = false;
    let staffConfirmation = false;
    let clientScoresPanel = false;

    switch(currentComp) {
        case "purchaseValue":
            purchaseValue = true;
            break;
        case "staffConfirmation":
            staffConfirmation = true;
            break;
        case "clientScoresPanel":
            clientScoresPanel = true;
            break;
        default:
            console.log("Something is wrong with your name")
    }


    const styles = {
        finishButton: {
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.5em',
            padding: '25px 35px',
            borderRadius: '20px',
            backgroundColor: 'var(--mainPink)',
            color: 'var(--mainWhite)',
            outline: 'none',
        }
    }

    const showHomeBtn = () => {
        const title = "Finalizar";
        const backColorOnHover = "pink";
        const backgroundColor = "var(--mainPink)";
        return(
            <Link to={isThisApp() ? "/mobile-app" : "/acesso/verificacao"} style={{textDecoration: "none"}}>
                <button
                    className="text-shadow mt-5 pressed-to-left"
                    style={styles.finishButton}
                    onClick={() => {
                        showComponent(dispatch, "login")
                        !isThisApp() && logout(dispatch);
                        if(isThisApp()) { window.location.href = `/mobile-app` }
                    }}
                    onMouseOver={e => e.target.style.backgroundColor=backColorOnHover}
                    onMouseOut={e => e.target.style.backgroundColor=backgroundColor}
                >
                    {title}
                </button>
            </Link>
        );
    };

    return (
        <div style={{color: 'white'}} className="d-flex flex-column-reverse flex-md-row justify-content-center">
            <PurchaseValue
                success={purchaseValue}
                setValuePaid={setValuePaid}
            />
            <StaffConfirmation
                success={staffConfirmation}
                setVerification={setVerification}
            />
            <ClientScoresPanel
                success={clientScoresPanel}
                valuePaid={valuePaid}
                verification={verification}
            />
            <div className="container-center-col">
                <img src="/img/logo.svg" alt="logo" width={300} height={300}/>
                {clientScoresPanel && showHomeBtn()}
            </div>
            <Fragment>
               {
                    !purchaseValue &&
                    !staffConfirmation &&
                    !clientScoresPanel &&
                    <HomeButton />
               }
            </Fragment>
        </div>
    );
}
