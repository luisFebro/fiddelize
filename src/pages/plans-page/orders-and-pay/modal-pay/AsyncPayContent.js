import PayCategories from "./payment-methods/PayCategories";
import { ShowPayWatermarks } from "./comps/GlobalComps";
import "./_PayContent.scss";

export default function AsyncPayContent({ modalData }) {
    const { firstName } = modalData;

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
                {firstName},
                <br />
                como quer investir hoje?
            </p>
        </div>
    );

    const showFiddelizePayBackChallenge = () => (
        <div className="mx-3 my-3 text-purple text-center text-normal">
            Satisfação com serviços da Fiddelize em{" "}
            <span className="text-pill">30 dias</span> ou seu{" "}
            <strong>dinheiro retornado</strong>.
        </div>
    );

    return (
        <section>
            {showTitle()}
            {showSubtitle()}
            <PayCategories modalData={modalData} />
            {showFiddelizePayBackChallenge()}
            <ShowPayWatermarks />
        </section>
    );
}

/* ARCHIVED FRONT-END RENEWAL HANDLERS

import getVar from "init/var";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

handleRenewalDays({
    setRenewalData,
    itemList,
    renewalDaysLeft,
    renewalReference,
    isSingleRenewal,
    reference,
});


const checkUltimateRenewal = ({ itemList, bizPlanList = [] }) => {
    if ((bizPlanList && !bizPlanList.length) || !itemList)
        return { res: false };

    const lastOrderServices = itemList && Object.keys(itemList); // only services e.g ["Novvos Clientes, P. Clientes"]

    let res = false;
    let ultimateDaysLeft;

    bizPlanList.forEach((s) => {
        if (lastOrderServices.includes(s.service)) {
            res = true;
            ultimateDaysLeft = getDatesCountdown(s.usageTimeEnd);
        }
    });

    return { res, ultimateDaysLeft };
};

const handlePeriodDays = (reference) => {
    const referenceArray = reference && reference.split("-");
    const [, , per] = referenceArray;

    if (per === "A") return 365;
    if (per === "M") return 30;
};

const handleDaysLeft = ({ renewalDaysLeft, ultimateDaysLeft }) => {
    if (ultimateDaysLeft) return ultimateDaysLeft;
    return renewalDaysLeft ? Number(renewalDaysLeft) : undefined;
};

function handleRenewalDays({
    itemList,
    setRenewalData,
    renewalDaysLeft,
    renewalReference,
    isSingleRenewal,
    reference,
}) {
    getVar("proData", "request_api_data").then((proData) => {
        const bizPlanList = proData && proData.bizPlanList;
        // for cases when client-admin buys something from the service store and not pass by the front-end system handled by isSingleRenewal or isRenewal
        // Here checkes if the current order statement includes some priorly bought service. This is critical to apply the correct date.
        const {
            res: isUltimateRenewal,
            ultimateDaysLeft,
        } = checkUltimateRenewal({ itemList, bizPlanList });

        const res = {
            newRenewalDaysLeft:
                handleDaysLeft({ renewalDaysLeft, ultimateDaysLeft }) || 0,
            renewalCurrDays:
                renewalReference || isSingleRenewal || isUltimateRenewal
                    ? handlePeriodDays(reference)
                    : undefined,
            renewalReady: true,
        };
        setRenewalData(res);
    });
}


 */
