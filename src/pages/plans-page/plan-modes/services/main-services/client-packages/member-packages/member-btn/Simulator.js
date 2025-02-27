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

const getMembersData = (packages, isYearly) => {
    // unit, expires, unitSizeDec
    const period = isYearly ? "yearly" : "monthly";
    const unit = pricing.bronze["Connecta Membros"].prices.units[period][0];
    const credit = pricing.bronze["Connecta Membros"].credits[period];

    if (packages === credit[0]) return [unit, null, "1"];
    if (packages === credit[1]) return [unit, null, "1"];
    if (packages === credit[2]) return [unit, null, "1"];
    if (packages === credit[3]) return [unit, null, "1"];

    return [unit, null, "1"];
};

export default function Simulator({ handleData, period, currPlan }) {
    const [packages, setPackages] = useState(1);
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
            setPackages(newQuantity);
        } else {
            setPackages(1);
        }
    }, [newQuantity]);

    const [unit, , unitSizeDec] = getMembersData(packages, isYearly);

    const handlePackages = (newValue) => {
        setPackages(newValue);
    };

    const styles = getStyles();

    const subject = "membro";
    const onePackage = 1;
    const totalUnits = onePackage * packages;
    const totalFinalMoney = totalUnits * unit;

    const MAX_UNIT_YEAR = 5;
    const MAX_UNIT_MONTH = 5;

    const totalReal = convertToReal(totalUnits);
    const unitReal = isYearly ? getYearlyUnit(unit) : unit.toFixed(2);

    const totalFinalMoneyReal = convertToReal(totalFinalMoney);

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
                        isYearly ? "1-3" : unitSizeDec
                    } font-site ${
                        unit === 0.08 || unit === 0.09 ? "font-weight-bold" : ""
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
                min={1}
                step={1}
                value={packages}
                callback={handlePackages}
                disabled={!!newQuantity}
                needSlideInstru
            />
            {packages <= 4 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardRight}
                >
                    {isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                    <br />
                    {subject}s
                </div>
            )}

            {packages >= 3 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardLeft}
                >
                    1<br />
                    {subject}
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
    return monthlyInv && monthlyInv.toFixed(2);
}
// END HELPERS

/* ARCHIVES
The reason the yearly plan credited by month system was discontinued was because increase expiration and renovation complexity with multiple dates.
We are out of time to handle complex system.
Also,customers will have some potential issues with renovation if they run out of credits.

const showYearlyPlanNote = () => {
    if (!isYearly) return <span />;

    return (
        <section className="mt-2 mb-4 text-normal text-purple">
            Você tem alcance de até:
            <br />
            <span className="text-pill">
                {totalUnits} membro{totalUnits > 1 ? "s" : ""}
            </span>{" "}
            ao longo de 1 ano.
        </section>
    );
};

    useEffect(() => {
        if (unit !== 0.14) {
            const diff = firstPhasePrice - totalFinalMoney;
            const incPerc = getIncreasedPerc(totalFinalMoney, firstPhasePrice);
            setDiscountDiff(diff);
            setIncreasedPerc(incPerc);
        } else {
            setDiscountDiff(null);
        }
    }, [unit, firstPhasePrice]);

const showDiffDiscount = () =>
        Boolean(discountDiff) && (
            <section
                className={`my-5 ${animaDisabled ? "" : "zoomIn animated"}`}
            >
                <h2 className="text-purple text-center text-subtitle font-weight-bold m-0">
                    Automatizador de Desconto
                </h2>
                <p className="text-normal text-purple text-left">
                    Você economiza{" "}
                    <span className="text-subtitle font-weight-bold">
                        {discountDiffReal} ({Math.ceil(increasedPerc)}%)
                    </span>{" "}
                    <span className="d-none">
                        comparado com o preço total de {firstPhasePriceReal} -
                        R$ 1,00 por {subject};
                    </span>
                </p>
            </section>
        );

const packageMarks = [
        value: 1,
        label: "",
    },
    {
        value: 5,
        label: "",
    },
    {
        value: 10,
        label: "",
    },
    {
        value: 50,
        label: "",
    },
    {
        value: 100,
        label: "",
    },
    {
        value: 200,
        label: "",
    },
];


const showQuantityField = () => (
    (packages >= 290 || Boolean(newQuantity)) &&
    <section className="animated fadeInUp slow
    my-3 d-flex align-items-center justify-content-end">
        <p className="text-purple font-weight-bold text-normal text-center mr-2">
            Precisa de mais pacotes?
        </p>
        <div>
            <p className="m-0 text-left text-purple text-normal font-weight-bold">
                Insira aqui:
            </p>
            <TextField
                InputProps={{ style: styles.quantityField }}
                variant="outlined"
                onChange={handleChange(setData)}
                onKeyPress={null}
                autoComplete="off"
                type="tel"
                name="newQuantity"
                value={newQuantity}
            />
            <p className="m-0 text-right text-purple text-normal font-weight-bold">
                Quantidade
            </p>
        </div>
    </section>
);
 */
