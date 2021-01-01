import React, { useState, useEffect } from "react";
import "./_PayContent.scss";
import PayCategories from "./payment-methods/PayCategories";
// import { Load } from "../../../../components/code-splitting/LoadableComp";
import { useAppSystem } from "../../../../hooks/useRoleData";
import { ShowPayWatermarks } from "./comps/GlobalComps";
import handleRenewalDays from "./helpers/handleRenewalDays";
import useData from "../../../../hooks/useData";

export default function AsyncPayContent({ modalData }) {
    const {
        reference,
        ordersStatement,
        isSingleRenewal,
        renewalDaysLeft,
        renewalReference,
    } = modalData; // n1 notes about PagSeguro Methods

    const [renewalData, setRenewalData] = useState({
        newRenewalDaysLeft: null,
        renewalCurrDays: null,
        renewalReady: false,
    });
    const { newRenewalDaysLeft, renewalCurrDays, renewalReady } = renewalData;

    useEffect(() => {
        handleRenewalDays({
            setRenewalData,
            ordersStatement,
            renewalDaysLeft,
            renewalReference,
            isSingleRenewal,
            reference,
        });
    }, [
        reference,
        renewalReference,
        renewalDaysLeft,
        isSingleRenewal,
        ordersStatement,
    ]);

    const { businessId } = useAppSystem();
    const [userName, userFirstName] = useData(["name", "firstName"]);

    const methodsModalData = {
        userId: businessId,
        userName,
        userFirstName,
        renewalCurrDays,
        renewalDaysLeft: newRenewalDaysLeft,
        renewalReference: renewalReference ? renewalReference : undefined,
        ...modalData,
    };

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    // selecione a sua forma de investir favorita
    const showSubtitle = () => (
        <div className="mx-2 my-5">
            <p className="text-subtitle main-font text-purple text-center font-weight-bold">
                {userFirstName},
                <br />
                como quer investir hoje?
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            {showSubtitle()}
            <PayCategories modalData={methodsModalData} />
            <ShowPayWatermarks />
        </section>
    );
}
