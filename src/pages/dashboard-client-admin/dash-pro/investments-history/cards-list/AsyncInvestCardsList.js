import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { calendar } from "utils/dates/dateFns";
import { useBizData } from "init";
import Img from "components/Img";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
// import { isScheduledDate } from 'utils/dates/dateFns';
import useAPIList, { readUserOrderHistory } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import convertToReal from "utils/numbers/convertToReal";
import InvestCard from "./card/accordion/InvestCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";

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
                Gerado em: {calendar(data.createdAt)}.
            </span>
        </p>
    </section>
);
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const { bizId } = useBizData();

    const styles = getStyles();

    const params = { userId: bizId, skip };

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
        url: readUserOrderHistory(),
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

    const displayPlanType = (planCode, period) => {
        const plan = handlePlanCode(planCode);

        const generatedPeriod = handlePeriod(period);
        const planDesc = `P. ${plan && plan.cap()} ${generatedPeriod}`;

        return (
            <section className="d-flex">
                <FontAwesomeIcon
                    icon="crown"
                    className="mr-2"
                    style={{
                        ...styles.icon,
                        color: handleColor(plan),
                        filter: handleFilter({ plan }),
                    }}
                />
                <span
                    className="position-relative  d-inline-block text-subtitle font-weight-bold text-shadow"
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
            } = data;

            const referenceArray = reference && reference.split("-");
            const [planCode, , period, range] = referenceArray;

            const chosenPlan = handlePlanCode(planCode);
            const chosenPeriod = handlePeriod(period, range);
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
                        <span className="main-font d-inline-block mt-3 text-em-1 font-weight-bold">
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
                needToggleButton
            />
        );
    };

    const showEmptyData = () => (
        <section>
            <Img
                className="img-fluid margin-auto-90"
                src="/img/illustrations/empty-fiddelize-invest.svg"
                offline
                alt="sem investimentos"
                title={`Sem investimentos. <p class="text-em-0-8 line-height-30">Conquiste mais clientes oferecendo moeda digital exclusiva para troca de benefícios.</p>`}
            />
            <div
                className="mt-3 container-center"
                style={{
                    marginBottom: 150,
                }}
            >
                <Link
                    to="/planos?cliente-admin=1"
                    className="no-text-decoration"
                >
                    <ButtonFab
                        size="large"
                        title="ENTRE PARA O CLUBE"
                        position="relative"
                        onClick={null}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                    />
                </Link>
            </div>
        </section>
    );

    return (
        <Fragment>
            {needEmptyIllustra ? showEmptyData() : showAccordion()}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            <ShowOverMsg />
        </Fragment>
    );
}

// HELPERS
function handlePlanCode(code) {
    if (code === "OU") return "ouro";
    if (code === "PR") return "prata";
    if (code === "BR") return "bronze";
    return "extra";
}

function handlePeriod(per, range) {
    if (range === "EX") return "Extra";
    if (per === "A") return "Anual";
    if (per === "M") return "Mensal";
    return "Extra";
}

function handlePeriodDays(per) {
    if (per === "A") return 365;
    if (per === "M") return 30;
    return 0;
}

function handleColor(plan) {
    if (plan === "ouro") return "yellow";
    if (plan === "prata") return "white";
    if (plan === "bronze") return "#edbead";
}

function handleFilter({ plan }) {
    if (plan === "bronze") return "drop-shadow(black 0.001em 0.001em 0.5em)";

    return "drop-shadow(0.001em 0.001em 0.15em grey)";
}
// END HELPERS

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/
