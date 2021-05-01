import { Fragment, useState } from "react";
import IncomeCard from "./card/accordion/IncomeCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../../utils/dates/dateFns";
import Img from "../../../../../../components/Img";
// import { isScheduledDate } from '../../../../../../utils/dates/dateFns';
import useAPIList, {
    readAgentIncomeHistory,
} from "../../../../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../../hooks/api/useElemDetection";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import useData from "init";
import extractStrData from "../../../../../../utils/string/extractStrData";
import getDatesCountdown from "../../../../../../hooks/dates/getDatesCountdown";

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

const handleSecHeading = (data, styles) => (
    <section>
        <p
            className="text-nowrap position-absolute d-block m-0 mt-3"
            style={styles.dateBadge}
        >
            <span className="text-small text-shadow font-weight-bold">
                {calendar(data.createdAt)}.
            </span>
        </p>
    </section>
);
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const styles = getStyles();

    const [uniqueLinkId, primaryAgent] = useData([
        "uniqueLinkId",
        "primaryAgent",
    ]);

    const params = { uniqueLinkId, primaryAgent, skip };

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        listTotal,
        hasMore,
        isOffline,
        ShowOverMsg,
        content,
    } = useAPIList({
        url: readAgentIncomeHistory(),
        skip,
        params,
        trigger: uniqueLinkId !== "...",
        forceTrigger: true,
        listName: "incomeCardsList",
    });

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const displayCustomerInvest = (data) => {
        const clientName = data.name && data.name.cap();
        const investedQuantity = data.investAmount;

        return (
            <section>
                <span
                    className="position-relative  d-inline-block text-normal text-shadow"
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    <span className="font-weight-bold text-white">
                        {clientName}
                    </span>{" "}
                    investiu:{" "}
                    <span className="text-normal text-shadow">
                        {convertToReal(investedQuantity, {
                            moneySign: true,
                            needFraction: true,
                        })}
                    </span>
                </span>
            </section>
        );
    };

    const showAccordion = () => {
        const actions = list.map((data) => {
            const { escrowEndDate, paymentMethod } = data;
            console.log("paymentMethod", paymentMethod);
            const daysLeftMoneyAvalaible = !escrowEndDate
                ? null
                : getDatesCountdown(escrowEndDate);
            const pluralDaysLeftMoney = daysLeftMoneyAvalaible > 1 ? "s" : "";

            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayCustomerInvest(data)}
                    <div
                        className="mt-3 font-weight-bold text-shadow text-normal"
                        style={{
                            color: "var(--lightGreen)",
                        }}
                    >
                        <span className="text-small font-weight-bold">
                            Você ganhou:
                        </span>
                        <br />
                        {convertToReal(data.splitAgentAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}{" "}
                        {daysLeftMoneyAvalaible <= 0 ||
                        paymentMethod === "pix" ? (
                            <span
                                className="text-small text-white font-weight-bold"
                                style={{
                                    backgroundColor: "green",
                                    borderRadius: "30px",
                                    padding: "2px 6px",
                                    border: "var(--mainWhite) solid 2px",
                                }}
                            >
                                Pago
                            </span>
                        ) : (
                            <span className="main-font text-shadow d-inline-block text-small font-weight-bold">
                                (+{daysLeftMoneyAvalaible} dia
                                {pluralDaysLeftMoney})
                            </span>
                        )}
                    </div>
                </section>
            );

            const HiddenPanel = <PanelHiddenContent data={data} />;
            const sideHeading = handleSecHeading(data, styles);

            return {
                _id: data._id,
                mainHeading,
                secondaryHeading: sideHeading,
                data,
                hiddenContent: HiddenPanel,
            };
        });

        return (
            <IncomeCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton
            />
        );
    };

    const showEmptyData = () => (
        <section className="my-5">
            <Img
                className="img-fluid margin-auto-90"
                src="/img/illustrations/empty-fiddelize-invest.svg"
                offline
                alt="sem rendas de clientes"
                title="Sem rendas de clientes."
            />
        </section>
    );

    const showTotals = () => {
        const { totalClients } = extractStrData(content);

        const incomeTotal = loading ? "..." : listTotal;
        const registeredClientsTotal = loading ? "..." : totalClients;
        const plural = incomeTotal >= 2 ? "s" : "";
        const pluralClients = registeredClientsTotal >= 2 ? "s" : "";

        return (
            <div className="text-purple text-subtitle font-weight-bold position-relative">
                <span className="text-subtitle font-weight-bold">
                    Totais Gerais:
                </span>
                <br />
                <strong className="text-normal">
                    •{" "}
                    <span className="text-pill">
                        {registeredClientsTotal || 0}
                    </span>{" "}
                    cliente{pluralClients} pagante{pluralClients}
                </strong>
                <br />
                <strong className="text-normal">
                    • <span className="text-pill">{incomeTotal}</span> renda
                    {plural}
                </strong>
            </div>
        );
    };

    return (
        <Fragment>
            {showTotals()}
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
