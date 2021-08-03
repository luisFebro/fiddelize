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
    totalCustomers: {
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
        value: 800,
        label: "",
    },
    {
        value: 1000,
        label: "",
    },
];

const getCustomersData = (packages, options = {}) => {
    const { initialPrice, period } = options;
    const isYearly = period === "yearly";
    // unit, expires, unitSizeDec, unitSizeInc
    if (packages === 500) return [isYearly ? 0.6 : 0.06, null, "1-1", "1-1"];
    if (packages === 600) return [isYearly ? 0.59 : 0.059, null, "1", "1-2"];
    if (packages === 700) return [isYearly ? 0.57 : 0.057, null, "0-9", "1-3"];
    if (packages === 800) return [isYearly ? 0.56 : 0.056, null, "0-8", "1-4"];

    return [isYearly ? 0.5 : 0.05, null, "0-8", "1-4"];
};

export default function Simulator({ handleData, period, currPlan }) {
    const [packages, setPackages] = useState(500);
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
            setPackages(500);
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
    const unitReal = unit.toFixed(3);
    const yearToMonthUnit = convertToReal(unit / 12, {
        moneySign: true,
        needFraction: true,
    });
    const totalFinalMoneyReal = Math.round(Number(totalFinalMoney));
    // const discountDiffReal = convertToReal(discountDiff, { moneySign: true });

    useEffect(() => {
        handleData({
            totalPackage: packages,
            totalUnits,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        });
    }, [packages]);

    const showMultiPrice = () => (
        <section className="mt-3 text-center">
            <span
                className="d-inline-block ml-2 text-title text-purple"
                style={styles.totalUnits}
            >
                <span className="text-em-1-2 font-site text-nowrap">
                    + {totalReal} {subject}
                    {packages === 1 ? "" : "s"}
                </span>
                <br />
                <div
                    className={`text-em-${
                        isYearly ? "1-3" : unitSizeDec
                    } font-site ${
                        unit === 0.08 || unit === 0.09 ? "font-weight-bold" : ""
                    }`}
                    style={{ lineHeight: "20px" }}
                >
                    <span className="text-title"> X </span>
                    R$ {unitReal}
                    {isYearly && (
                        <span className="d-inline-block text-small">
                            apenas <strong>{yearToMonthUnit}</strong>{" "}
                            {packages !== 1 && "(cada)"} ao mês
                        </span>
                    )}
                </div>
            </span>
        </section>
    );

    const showAutoFinalTotal = () => (
        <section className="mt-2 mb-5 text-hero text-purple text-center">
            <span className="d-inline-block text-title">R$</span>
            {totalFinalMoneyReal}
        </section>
    );

    const handlePlanName = () => {
        if (currPlan === "ouro") return currPlan.cap();
        if (currPlan === "prata") return currPlan.cap();
        return "Bronze";
    };

    const showSummary = () => (
        <section className="my-5 zoomIn animated">
            <h2 className="text-purple text-center text-subtitle font-weight-bold m-0">
                Resumo de Investimento
            </h2>
            <div className="text-normal text-left text-purple">
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
        </section>
    );

    const showSlider = () => (
        <section className="position-relative">
            <MuSlider
                color="var(--themeP)"
                max={isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                min={500}
                marks={countMarks}
                step={null}
                value={packages}
                callback={handlePackages}
                disabled={!!newQuantity}
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
                    500
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
