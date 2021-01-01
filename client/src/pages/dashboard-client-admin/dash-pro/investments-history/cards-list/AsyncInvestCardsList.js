import React, { Fragment, useState, useEffect } from "react";
import InvestCard from "./card/accordion/InvestCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../utils/dates/dateFns";
import parse from "html-react-parser";
import { useAppSystem } from "../../../../../hooks/useRoleData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from "../../../../../utils/string/getFirstName";
import { useRunComp } from "../../../../../hooks/useRunComp";
import Img from "../../../../../components/Img";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import { Link } from "react-router-dom";
// import { isScheduledDate } from '../../../../../utils/dates/dateFns';
import useAPIList, {
    readTransactionHistory,
    readSMSMainHistory,
} from "../../../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../hooks/api/useElemDetection";
import convertToReal from "../../../../../utils/numbers/convertToReal";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    icon: {
        fontSize: 35,
        color: "white",
        filter: "drop-shadow(0.001em 0.001em 0.15em grey)",
    },
    dateBadge: {
        left: isSmall ? -15 : 0,
        bottom: isSmall ? -30 : -20,
        backgroundColor: "var(--themeP)",
        padding: "0px 15px",
        borderRadius: "20%",
    },
});

const handleSecHeading = (data, styles) => {
    return (
        <section>
            <p
                className="text-nowrap position-absolute d-block m-0 mt-3"
                style={styles.dateBadge}
            >
                <span className="text-small text-shadow font-weight-bold">
                    Gerado em: {calendar(data.createdAt)}.
                </span>
            </p>
        </section>
    );
};
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const { businessId } = useAppSystem();

    const styles = getStyles();

    const params = { userId: businessId, skip };

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readTransactionHistory(),
        skip,
        params,
        listName: "investCardsList",
    });
    // console.log("lsitMOFO", listMOFO)
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const handlePlanCode = (code) => {
        if (code === "OU") return "ouro";
        if (code === "PR") return "prata";
        if (code === "BR") return "bronze";
    };

    const handlePeriod = (per) => {
        if (per === "A") return "Anual";
        if (per === "M") return "Mensal";
    };

    const handlePeriodDays = (per) => {
        if (per === "A") return 365;
        if (per === "M") return 30;
    };

    const displayPlanType = (planCode, period, ordersStatement) => {
        const plan = handlePlanCode(planCode);

        const keys = ordersStatement && Object.keys(ordersStatement);
        const isUnlimitedService = ordersStatement && keys && keys[0] === "sms"; // like SMS with a long hardcoded date;

        const generatedPeriod = isUnlimitedService
            ? "Ilimitado"
            : handlePeriod(period);
        const planDesc = `P. ${plan && plan.cap()} ${generatedPeriod}`;

        const handleColor = (plan) => {
            if (plan === "ouro") return "yellow";
            if (plan === "prata") return "white";
            if (plan === "bronze") return "#edbead";
        };

        return (
            <section className="d-flex">
                <FontAwesomeIcon
                    icon="crown"
                    className="mr-2"
                    style={{
                        ...styles.icon,
                        color: handleColor(plan),
                        filter:
                            plan === "bronze"
                                ? "drop-shadow(black 0.001em 0.001em 0.5em)"
                                : "drop-shadow(0.001em 0.001em 0.15em grey)",
                    }}
                />
                <span
                    className={`position-relative  d-inline-block text-subtitle font-weight-bold text-shadow`}
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {planDesc}
                </span>
            </section>
        );
    };

    const showAccordion = () => {
        const actions = list.map((data) => {
            const {
                reference,
                paymentMethod, // boleto, crédito, débito.
                ordersStatement,
            } = data;

            const referenceArray = reference && reference.split("-");
            const [planCode, qtt, period] = referenceArray;

            const chosenPlan = handlePlanCode(planCode);
            const chosenPeriod = handlePeriod(period);
            const periodDays = handlePeriodDays(period);

            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayPlanType(planCode, period, ordersStatement)}
                    <p
                        className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: "25px" }}
                    >
                        <span className="main-font text-em-1-4 font-weight-bold">
                            {convertToReal(data.investAmount, {
                                moneySign: true,
                            })}
                        </span>
                        <br />
                        <span className="main-font text-em-1 font-weight-bold">
                            via {paymentMethod}.
                        </span>
                    </p>
                </section>
            );

            const HiddenPanel = <PanelHiddenContent data={data} />;
            const sideHeading = handleSecHeading(data, styles);

            return {
                _id: data._id,
                mainHeading,
                secondaryHeading: sideHeading,
                // data here is immutable only. If you need handle a mutable data, set it to teh card's actions iteration.
                data: { ...data, periodDays, chosenPlan, chosenPeriod },
                hiddenContent: HiddenPanel,
            };
        });

        return (
            <InvestCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
            />
        );
    };

    const showEmptyData = () => {
        return (
            <section>
                <Img
                    className="img-fluid margin-auto-90"
                    src="/img/illustrations/empty-fiddelize-invest.svg"
                    offline={true}
                    alt="sem investimentos"
                    title="Sem investimentos. Seu porquinho está vazio."
                />
                <div className="mt-3 mb-5 container-center">
                    <Link
                        to="/planos?cliente-admin=1"
                        className="no-text-decoration"
                    >
                        <ButtonFab
                            size="large"
                            title="FAZER O PRIMEIRO"
                            position="relative"
                            onClick={null}
                            backgroundColor={"var(--themeSDark--default)"}
                            variant="extended"
                        />
                    </Link>
                </div>
            </section>
        );
    };

    return (
        <Fragment>
            {needEmptyIllustra ? showEmptyData() : showAccordion()}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            <ShowOverMsg />
        </Fragment>
    );
}

/*
const showSearchBar = () => (
    <section className="d-none container-center my-4">
        <span className="position-relative">
        </span>
    </section>
);
 */

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/
