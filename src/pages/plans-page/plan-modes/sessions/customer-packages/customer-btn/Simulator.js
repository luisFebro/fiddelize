import { useState, useEffect } from "react";
import convertToReal from "utils/numbers/convertToReal";
import MuSlider from "components/sliders/MuSlider";
import { addDays, formatSlashDMY } from "utils/dates/dateFns";

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

const countMarks = [
    {
        value: 300,
        label: "",
    },
    {
        value: 400,
        label: "",
    },
    {
        value: 500,
        label: "",
    },
    {
        value: 600,
        label: "",
    },
    {
        value: 700,
        label: "",
    },
    {
        value: 1000,
        label: "",
    },
];

const getCustomersData = (packages, isYearly) => {
    // unit, expires, unitSizeDec
    if (packages === 300) return [isYearly ? 1 : 0.1, null, "1-2"];
    if (packages === 400) return [isYearly ? 0.87 : 0.087, null, "1-1"];
    if (packages === 500) return [isYearly ? 0.8 : 0.08, null, "1"];
    if (packages === 600) return [isYearly ? 0.75 : 0.075, null, "0-9"];
    if (packages === 700) return [isYearly ? 0.71 : 0.071, null, "0-9"];

    return [isYearly ? 0.6 : 0.06, null, "0-8"];
};

export default function Simulator({ handleData, period, currPlan }) {
    const [packages, setPackages] = useState(300);
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
        if (period === "yearly") thisUsageDays = 365;
        const thisExpiryDate = addDays(new Date(), thisUsageDays);
        const thisFormattedDate = formatSlashDMY(thisExpiryDate);

        setData({
            ...data,
            expiryDate: thisExpiryDate,
            formattedExpiryDate: thisFormattedDate,
            usageDays: thisUsageDays,
        });
    }, [period]);

    useEffect(() => {
        if (newQuantity && !Number.isNaN(newQuantity)) {
            setPackages(newQuantity);
        } else {
            setPackages(300);
        }
    }, [newQuantity]);

    const [unit, , unitSizeDec] = getCustomersData(packages, isYearly);

    const handlePackages = (newValue) => {
        setPackages(newValue);
    };

    const styles = getStyles();

    const subject = "cliente";
    const onePackage = 1;
    const totalUnits = onePackage * packages;
    const totalFinalMoney = totalUnits * unit;

    const MAX_UNIT_YEAR = 1000;
    const MAX_UNIT_MONTH = 1000;

    const totalReal = convertToReal(totalUnits);
    const unitReal = isYearly ? getYearlyUnit(unit) : unit.toFixed(2);

    const totalFinalMoneyReal = Math.round(Number(totalFinalMoney));
    // const discountDiffReal = convertToReal(discountDiff, { moneySign: true });

    useEffect(() => {
        handleData({
            totalPackage: packages,
            totalCustomers: totalUnits,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        });
    }, [packages]);

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

    const showMultiPrice = () => (
        <section className="mt-3 text-center">
            <span
                className="d-inline-block ml-2 text-title text-purple"
                style={styles.totalUnits}
            >
                <span className="font-weight-bold text-em-1-2 font-site text-nowrap">
                    + {totalReal}
                    <span className="d-block line-height-35">
                        Novo{packages === 1 ? "" : "s"}
                        <span className="d-block m-0">
                            {subject}
                            {packages === 1 ? "" : "s"}
                        </span>
                    </span>
                </span>
                <div
                    className={`mt-2 text-grey position-relative d-block text-em-${
                        isYearly ? "1-2" : unitSizeDec
                    } font-site ${
                        unit === 0.71 || unit === 0.06 ? "font-weight-bold" : ""
                    }`}
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
                        {isYearly ? "cada no mês" : "cada"}
                    </span>
                </div>
            </span>
            {showYearlyPlanNote()}
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
                <span className="text-subtitle font-weight-bold">
                    {packages}
                </span>
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
                min={300}
                marks={countMarks}
                step={null}
                value={packages}
                callback={handlePackages}
                disabled={!!newQuantity}
                needSlideInstru
            />
            {packages <= 860 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardRight}
                >
                    {isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                    <br />
                    {subject}s
                </div>
            )}

            {packages >= 600 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardLeft}
                >
                    300
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

function getYearlyUnit(totalUnitAmount = 0) {
    const monthlyInv = totalUnitAmount / 12;
    return monthlyInv && (monthlyInv / 30).toFixed(5);
}
