import React, { Fragment, useState } from 'react';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import PurchaseValue from './PurchaseValue';
import StaffConfirmation from './StaffConfirmation';
import ClientScoresPanel from './ClientScoresPanel';
import HomeButton from '../../../components/buttons/HomeButton';

export default function LoyaltyScoreHandler() {
    const [valuePaid, setValuePaid]  = useState("1050");
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

    return (
        <div style={{color: 'white'}} className="container-center">
            <PurchaseValue
                success={purchaseValue}
                setValuePaid={setValuePaid}
            />
            <StaffConfirmation
                success={staffConfirmation}
                valuePaid={valuePaid}
                setVerification={setVerification}
            />
            <ClientScoresPanel
                success={clientScoresPanel}
                valuePaid={valuePaid}
                verification={verification}
            />
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
