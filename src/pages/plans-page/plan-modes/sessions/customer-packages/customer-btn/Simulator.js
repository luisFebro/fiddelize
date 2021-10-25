import { useState, useEffect } from "react";
import convertToReal from "utils/numbers/convertToReal";
import MuSlider from "components/sliders/MuSlider";
import { addDays, formatSlashDMY } from "utils/dates/dateFns";
import pricing from "utils/biz/pricing";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    sms: {
        top: isSmall ? "50px" : "70px",
        left: "10px",
    },
    totalUnits: {
        fontWeight: "normal",
    },
    delimeterBoardLeft: {
        top: -45,
        left: -20,
        backgroundColor: "grey",
        color: "#fff",
        padding: "5px 8px",
        borderRadius: "30%",
        lineHeight: "18px",
    },
    delimeterBoardRight: {
        top: -45,
        right: -20,
        backgroundColor: "grey",
        color: "#fff",
        padding: "5px 8px",
        borderRadius: "30%",
        lineHeight: "18px",
    },
    quantityField: {
        width: "130px",
        backgroundColor: "var(--themeP)",
        color: "#fff",
        font: "bold 35px var(--mainFont)",
        zIndex: 2000,
    },
});

const getCreditList = (isYearly) => {
    const period = isYearly ? "yearly" : "monthly";
    const credits = pricing.bronze["Novvos Clientes"].credits[period];
    return credits;
};

const countMarks = (isYearly) => [
    {
        value: getCreditList(isYearly)[0],
        label: "",
    },
    {
        value: getCreditList(isYearly)[1],
        label: "",
    },
    {
        value: getCreditList(isYearly)[2],
        label: "",
    },
    {
        value: getCreditList(isYearly)[3],
        label: "",
    },
    {
        value: getCreditList(isYearly)[4],
        label: "",
    },
];

const getCustomersData = (count, isYearly) => {
    const period = isYearly ? "yearly" : "monthly";
    const unit = pricing.bronze["Novvos Clientes"].prices.units[period];
    const credit = getCreditList(isYearly);
    // unit, expires, unitSizeDec
    if (count === credit[0]) return [unit[0], null, "1-2"];
    if (count === credit[1]) return [unit[1], null, "1-1"];
    if (count === credit[2]) return [unit[2], null, "1"];
    if (count === credit[3]) return [unit[3], null, "0-9"];

    return [unit[4], null, "0-8"];
};

export default function Simulator({ handleData, period, currPlan }) {
    const [count, setCount] = useState(0);
    const [data, setData] = useState({
        newQuantity: null,
        expiryDate: "",
        usageDays: 30,
        formattedExpiryDate: "",
    });

    const { newQuantity, usageDays, formattedExpiryDate } = data;

    const isYearly = period === "yearly";

    useEffect(() => {
        let thisUsageDays = 30;
        if (isYearly) thisUsageDays = 365;
        const thisExpiryDate = addDays(new Date(), thisUsageDays);
        const thisFormattedDate = formatSlashDMY(thisExpiryDate);

        setData((prev) => ({
            ...prev,
            expiryDate: thisExpiryDate,
            formattedExpiryDate: thisFormattedDate,
            usageDays: thisUsageDays,
        }));
    }, [isYearly]);

    useEffect(() => {
        if (newQuantity && !Number.isNaN(newQuantity)) {
            setCount(newQuantity);
        } else {
            setCount(getCreditList(isYearly)[0]);
        }
    }, [newQuantity, isYearly]);

    const [unit, , unitSizeDec] = getCustomersData(count, isYearly);

    const handlePackages = (newValue) => {
        setCount(newValue);
    };

    const styles = getStyles();

    const subject = "cliente";
    const onePackage = 1;
    const totalUnits = onePackage * count;
    const totalFinalMoney = totalUnits * unit;

    const MAX_UNIT_YEAR = getCreditList(true).slice(-1)[0];
    const MAX_UNIT_MONTH = getCreditList(false).slice(-1)[0];
    const MIN_UNIT_YEAR = getCreditList(true)[0];
    const MIN_UNIT_MONTH = getCreditList(false)[0];

    const unitReal = isYearly ? getYearlyUnit(unit) : unit.toFixed(2);

    const totalFinalMoneyReal = Math.round(Number(totalFinalMoney));
    // const discountDiffReal = convertToReal(discountDiff, { moneySign: true });

    useEffect(() => {
        handleData({
            totalPackage: count,
            totalCount: totalUnits,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        });
    }, [count, totalUnits]);

    const showMultiPrice = () => (
        <section className="mt-3 text-center">
            <span
                className="d-inline-block ml-2 text-title text-purple"
                style={styles.totalUnits}
            >
                <span className="font-weight-bold text-em-1-2 font-site text-nowrap">
                    + {convertToReal(totalUnits)}
                    <span className="d-block line-height-35">
                        Novo{count === 1 ? "" : "s"}
                        <span className="d-block m-0">
                            {subject}
                            {count === 1 ? "" : "s"}
                        </span>
                    </span>
                </span>
                <div
                    className={`mt-2 text-grey position-relative d-block text-em-${unitSizeDec} font-site`}
                    style={{
                        lineHeight: "15px",
                        top: -10,
                        right: -30,
                    }}
                >
                    <span className="text-title"> X </span>
                    R$ {unitReal}
                    <span
                        className="position-relative d-block text-small font-weight-bold"
                        style={{
                            top: -10,
                            right: -50,
                        }}
                    >
                        cada
                    </span>
                </div>
            </span>
        </section>
    );

    const showAutoFinalTotal = () => (
        <section className="mt-1 mb-5 container-center text-hero text-purple text-center">
            <div className="text-pill">
                <span className="d-inline-block text-title">R$</span>
                {totalFinalMoneyReal}
                <span className="d-block text-small font-weight-bold">
                    {isYearly ? "por ano" : "por mês"}
                </span>
            </div>
        </section>
    );

    const handlePlanName = () => {
        if (currPlan === "ouro") return currPlan.cap();
        if (currPlan === "prata") return currPlan.cap();
        return "Bronze";
    };

    const showSummary = () => (
        <section className="invest-brief text-shadow my-5 zoomIn animated">
            <h2 className="my-2 line-height-30 text-center text-subtitle font-weight-bold m-0">
                Resumo de Investimento
            </h2>
            <div className="text-normal text-left">
                ✔ Plano: {handlePlanName()}{" "}
                {period === "yearly" ? "Anual" : "Mensal"}
                <br />✔ Total de {subject}s:{" "}
                <span className="text-subtitle font-weight-bold">{count}</span>
                <br />✔ Validade:{" "}
                <span className="text-normal font-weight-bold">
                    {usageDays} dias{" "}
                    <span className="text-small font-weight-bold">
                        - {formattedExpiryDate}
                    </span>
                </span>
                <br />✔ Valor a investir:{" "}
                <span className="text-subtitle font-weight-bold">
                    R$ {totalFinalMoneyReal}
                </span>
            </div>
            <style jsx>
                {`
                    .invest-brief {
                        background: var(--themeP);
                        border-radius: 20px;
                        color: #fff;
                        padding: 5px 8px;
                    }
                `}
            </style>
        </section>
    );

    const showSlider = () => (
        <section className="position-relative">
            <MuSlider
                color="var(--themeP)"
                max={isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                min={isYearly ? MIN_UNIT_YEAR : MIN_UNIT_MONTH}
                marks={countMarks(isYearly)}
                step={null}
                value={count}
                callback={handlePackages}
                disabled={!!newQuantity}
                needSlideInstru
            />
            {count <= (!isYearly ? 860 : 8600) && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardRight}
                >
                    {isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                    <br />
                    {subject}s
                </div>
            )}

            {count >= (!isYearly ? 600 : 6000) && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardLeft}
                >
                    {isYearly ? MIN_UNIT_YEAR : MIN_UNIT_MONTH}
                    <br />
                    {subject}s
                </div>
            )}
        </section>
    );

    return (
        <section className="my-5 mx-4">
            {showSlider()}
            {showMultiPrice()}
            {showAutoFinalTotal()}
            {showSummary()}
        </section>
    );
}

// HELPERS
function getYearlyUnit(totalUnitAmount = 0) {
    const monthlyInv = totalUnitAmount / 12;
    return monthlyInv && monthlyInv.toFixed(3);
}
// END HELPERS

/* ARCHIVES
The reason the yearly plan credited by month system was discontinued was because increase expiration and renovation complexity with multiple dates.
We are out of time to handle complex system.
Also,customers will have some potential issues with renovation if they run out of credits.

Plans

const showYearlyPlanNote = () => {
    if (!isYearly) return <span />;

    return (
        <section className="text-normal">
            Você tem alcance de até {convertToReal(totalUnits * 12)}{" "}
            cadastros de novos clientes ao longo de 1 ano, sendo{" "}
            {totalUnits} creditados a cada mês.
        </section>
    );
};

 */
