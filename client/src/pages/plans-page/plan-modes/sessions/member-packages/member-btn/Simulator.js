import React, { useState, useEffect } from "react";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import MuSlider from "../../../../../../components/sliders/MuSlider";
import isKeyPressed from "../../../../../../utils/event/isKeyPressed";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import getIncreasedPerc from "../../../../../../utils/numbers/getIncreasedPerc";
import { addDays, formatSlashDMY } from "../../../../../../utils/dates/dateFns";

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

const getMembersData = (packages) => {
    // unit, expires, unitSizeDec, unitSizeInc
    if (packages === 1) return [25, null, "1-1", "1-1"];
    if (packages === 2) return [23, null, "1", "1-2"];
    if (packages === 3) return [21, null, "0-9", "1-3"];
    if (packages === 4) return [19, null, "0-8", "1-4"];
    if (packages === 5) return [17, null, "0-8", "1-4"];
    if (packages >= 6 && packages < 50) return [15, null, "0-6", "1-5"];
    // only applied to yearly. Remember this value is doubled.
    if (packages >= 50 && packages < 70) return [12, null, "0-6", "1-5"];
    if (packages >= 70 && packages < 90) return [10, null, "0-6", "1-5"];
    if (packages >= 90) return [8, null, "0-6", "1-5"];
};

export default function Simulator({
    handleData,
    period,
    currPlan,
    animaDisabled,
}) {
    const [packages, setPackages] = useState(1);
    const [discountDiff, setDiscountDiff] = useState(null);
    const [increasedPerc, setIncreasedPerc] = useState(null);
    const [data, setData] = useState({
        newQuantity: null,
        expiryDate: "",
        usageDays: 30,
        formattedExpiryDate: "",
    });
    const { newQuantity, expiryDate, usageDays, formattedExpiryDate } = data;

    const isYearly = period === "yearly";

    const initialPrice = isYearly ? 50 : 25;

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
            setPackages(1);
        }
    }, [newQuantity]);

    let [unit, expires, unitSizeDec, unitSizeInc] = getMembersData(packages);

    unit = isYearly ? unit * 2 : unit;

    const handlePackages = (newValue) => {
        setPackages(newValue);
    };

    const styles = getStyles();

    const subject = "membro";
    const onePackage = 1;
    const totalUnits = onePackage * packages;
    const totalFinalMoney = totalUnits * unit;
    const firstPhasePrice = totalUnits * initialPrice;

    const MAX_UNIT_YEAR = 100;
    const MAX_UNIT_MONTH = 50;

    const totalReal = convertToReal(totalUnits);
    const unitReal = convertToReal(unit, {
        moneySign: true,
        needFraction: true,
    });
    const totalFinalMoneyReal = convertToReal(totalFinalMoney);
    const discountDiffReal = convertToReal(discountDiff, { moneySign: true });
    const firstPhasePriceReal = convertToReal(firstPhasePrice, {
        moneySign: true,
    });

    useEffect(() => {
        handleData({
            totalPackage: packages,
            totalUnits,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        });
    }, [packages]);

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

    const showMultiPrice = () => (
        <section className="mt-3 text-center">
            <span
                className="d-inline-block ml-2 text-title text-purple"
                style={styles.totalUnits}
            >
                <span
                    className={`text-em-${unitSizeInc} font-site text-nowrap`}
                >
                    {totalReal} {subject}
                    {packages === 1 ? "" : "s"}
                </span>
                <br />
                <span className="text-title"> X </span>
                <span
                    className={`text-em-${unitSizeDec} font-site ${
                        unit === 0.08 || unit === 0.09 ? "font-weight-bold" : ""
                    }`}
                >
                    {unitReal}
                </span>
            </span>
        </section>
    );

    const showAutoFinalTotal = () => (
        <section className="mt-2 mb-5 text-hero text-purple text-center">
            <span className="d-inline-block text-title">R$</span>
            {totalFinalMoneyReal}
        </section>
    );

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

    const handlePlanName = () => {
        if (currPlan === "ouro") return currPlan.cap();
        if (currPlan === "prata") return currPlan.cap();
        return "Meu Bronze";
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
                step={1}
                value={packages}
                callback={handlePackages}
                disabled={newQuantity ? true : false}
            />
            {packages <=
                (isYearly ? MAX_UNIT_YEAR * 0.3 : MAX_UNIT_MONTH * 0.2) &&
                !Boolean(newQuantity) && (
                    <div
                        className="position-absolute font-weight-bold text-shadow text-center"
                        style={styles.delimeterBoardRight}
                    >
                        {isYearly ? MAX_UNIT_YEAR : MAX_UNIT_MONTH}
                        <br />
                        {subject}s
                    </div>
                )}

            {packages >=
                (isYearly ? MAX_UNIT_YEAR * 0.3 : MAX_UNIT_MONTH * 0.2) &&
                !Boolean(newQuantity) && (
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

/* ARCHIVES
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
