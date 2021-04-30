import { Fragment, useState } from "react";
import { useStoreState, useStoreDispatch } from "easy-peasy";
import PurchaseValue from "./PurchaseValue";
import StaffConfirmation from "./StaffConfirmation";
import AsyncClientScoresPanel from "./AsyncClientScoresPanel";
import HomeButton from "../../../components/buttons/HomeButton";
import { useBizData } from "init";

export default function LoyaltyScoreHandler() {
    const [valuePaid, setValuePaid] = useState("0");
    const [verification, setVerification] = useState(false);

    const {
        selfThemeBackColor,
        selfThemePColor,
        selfThemeSColor,
    } = useBizData();

    const dispatch = useStoreDispatch();

    const { currentComp } = useStoreState((state) => ({
        currentComp: state.componentReducer.cases.currentComp,
    }));

    let purchaseValue = false;
    let staffConfirmation = false;
    let clientScoresPanel = false;

    switch (currentComp) {
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
            console.log("Something is wrong with your name");
    }

    return (
        <div
            style={{
                color: "white",
                backgroundColor: `var(--themeBackground--${selfThemeBackColor})`,
            }}
            className="container-center"
        >
            <PurchaseValue
                success={purchaseValue}
                setValuePaid={setValuePaid}
            />
            <StaffConfirmation
                success={staffConfirmation}
                valuePaid={valuePaid}
                setVerification={setVerification}
            />
            <AsyncClientScoresPanel
                success={clientScoresPanel}
                valuePaid={valuePaid}
                verification={verification}
                colorP={selfThemePColor}
                colorS={selfThemeSColor}
                colorBack={selfThemeBackColor}
            />
            <Fragment>
                {!purchaseValue && !staffConfirmation && !clientScoresPanel && (
                    <HomeButton />
                )}
            </Fragment>
        </div>
    );
}
