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

    // const list = [
    //     {
    //         barcode: "03399853012970000079619467101010784030000072000",
    //         createdAt: "2020-10-06T15:02:40.173Z",
    //         investAmount: "720.00",
    //         ordersStatement: {currPlan: {amount: 4, price: 720}},
    //         payDueDate: "2020-10-09",
    //         paymentCategory: "boleto",
    //         paymentLink: "https://pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=02628c7427cedc0785b76a449eb74f5bd8776d352c1662e474c5f963a4dd273fca67122e19f74a1f",
    //         paymentMethod: "boleto santander",
    //         planDueDate: "2022-10-06T15:08:03.820Z",
    //         reference: "OU-Q4-A-9FSL3T5",
    //         renewal: {priorRef: "OU-Q4-A-86QJC5Z", currRef: "OU-Q4-A-9FSL3T5", priorDaysLeft: 365, isPaid: true},
    //         transactionStatus: "em disputa",
    //         updatedAt: "2020-10-06T21:07:50.000Z",
    //         _id: "5f7c87103a90e7080c1e14ac",
    //     },
    //     {
    //         barcode: "03399853012970000079618993101015184030000072000",
    //         createdAt: "2020-10-06T14:43:15.759Z",
    //         investAmount: "720.00",
    //         ordersStatement: {currPlan: {amount: 4, price: 720}},
    //         payDueDate: "2020-10-09",
    //         paymentCategory: "boleto",
    //         paymentLink: "https://pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=bf496edeb9c2476eb07ff6563ebca1272b167c912963b4d00ae5b054e879eeb9aa3886f0f20b3b11",
    //         paymentMethod: "boleto santander",
    //         // planDueDate: "2022-10-06T15:08:03.820Z",
    //         reference: "OU-Q4-A-86QJC5Z",
    //         renewal: {priorRef: "OU-Q4-A-86QJC5Z", currRef: "OU-Q4-A-9FSL3T5", priorDaysLeft: 365, isOldCard: true, isPaid: true},
    //         transactionStatus: "em disputa",
    //         updatedAt: "2020-10-06T21:07:50.000Z",
    //         _id: "5f7c8283fb3d391368e1d2dd",
    //     },
    //     {
    //         barcode: "03399853012970000078820393701014483970000002500",
    //         createdAt: "2020-09-30T18:57:42.968Z",
    //         investAmount: "25.00",
    //         ordersStatement: {"Prêmmios Clientes": {amount: 4, price: 720}},
    //         payDueDate: "2020-10-03",
    //         paymentCategory: "boleto",
    //         paymentLink: "https://pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=07911e23602053d23cb9008fbce9f709a5d8abfed3896e7fbb4718781ad776053ef892b9188a2674",
    //         paymentMethod: "boleto santander",
    //         planDueDate: "2020-11-05T08:06:27.888Z",
    //         reference: "BR-Q1-M-5384JHV",
    //         transactionStatus: "pago",
    //         updatedAt: "2020-10-01T06:08:38.000Z",
    //         _id: "5f74d5265ca00800177488a9",
    //     }
    // ]
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

    const displayPlanType = (planCode, period) => {
        const plan = handlePlanCode(planCode);
        const generatedPeriod = handlePeriod(period);
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
                paymentCategory: payCategory, // boleto, crédito, débito.
            } = data;

            const referenceArray = reference && reference.split("-");
            const [planCode, qtt, period] = referenceArray;

            const chosenPlan = handlePlanCode(planCode);
            const chosenPeriod = handlePeriod(period);
            const periodDays = handlePeriodDays(period);

            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayPlanType(planCode, period)}
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
                            via {payCategory}.
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
                    src="/img/illustrations/empty-sms-history.png"
                    offline={true}
                    alt="club pro - boas vindas"
                    title="Entre para o club e comece a fiddelizar!"
                />
                <div className=" mb-5 container-center">
                    <ButtonFab
                        size="large"
                        title="ENTRAR"
                        position="relative"
                        onClick={null}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant="extended"
                    />
                </div>
            </section>
        );
    };

    return (
        <Fragment>
            {needEmptyIllustra ? null : showAccordion()}
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
