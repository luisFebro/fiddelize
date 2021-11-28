import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import convertToReal from "utils/numbers/convertToReal";
import MuSlider from "components/sliders/MuSlider";
import handleChange from "utils/form/use-state/handleChange";
import getIncreasedPerc from "utils/numbers/getIncreasedPerc";
import pricing from "utils/biz/pricing";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    sms: {
        top: isSmall ? "50px" : "70px",
        left: "10px",
    },
    totalSMS: {
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

const { units, packages, credits } = pricing.SMS;

const getSMSData = (packs) => {
    // unit, expires, unitSizeDec, unitSizeInc
    if (packs >= packages.slice(-1)[0])
        return [units.slice(-1)[0], null, "0-6", "1-5"];
    if (packs >= packages.slice(-2)[0])
        return [units.slice(-2)[0], null, "0-8", "1-4"];
    if (packs >= packages.slice(-3)[0])
        return [units.slice(-3)[0], null, "0-9", "1-3"];
    if (packs >= packages.slice(-4)[0])
        return [units.slice(-4)[0], null, "1", "1-2"];
    if (packs >= packages.slice(-5)[0])
        return [units.slice(-5)[0], null, "1-1", "1-1"];

    return [];
};

// WARNING: SMS is the last simulator with package oriented. Next service should be straight to credits instead of package measure
export default function Simulator({ handleData }) {
    const [packs, setPackages] = useState(1);
    const [discountDiff, setDiscountDiff] = useState(null);
    const [increasedPerc, setIncreasedPerc] = useState(null);
    const [data, setData] = useState({
        newQuantity: null,
    });

    const { newQuantity } = data;

    useEffect(() => {
        if (newQuantity && !Number.isNaN(newQuantity)) {
            setPackages(newQuantity);
        } else {
            setPackages(1);
        }
    }, [newQuantity]);

    const [unit, , unitSizeDec, unitSizeInc] = getSMSData(packs);

    const handlePackages = (newValue) => {
        setPackages(newValue);
    };

    const styles = getStyles();

    const creditsByPack = credits[0];
    const totalSMS = creditsByPack * packs;
    const firstPhasePrice = totalSMS * units[0];
    const totalFinalMoney = totalSMS * unit;

    const totalSMSReal = convertToReal(totalSMS);
    const smsUnitReal = convertToReal(unit, {
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
            totalPackage: packs,
            totalSMS,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        });
    }, [packs]);

    useEffect(() => {
        if (unit !== units[0]) {
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
                style={styles.totalSMS}
            >
                <span className={`text-em-${unitSizeInc} font-site`}>
                    {totalSMSReal} SMS
                </span>
                <br />
                <span className="text-title"> X </span>
                <span
                    className={`text-em-${unitSizeDec} font-site ${
                        unit <= units[3] ? "font-weight-bold" : ""
                    }`}
                >
                    {smsUnitReal}
                </span>
            </span>
        </section>
    );

    const showAutoFinalTotal = () => (
        <section className="mt-1 mb-5 container-center text-hero text-purple text-center">
            <div className="text-pill px-3 py-2">
                <span className="d-inline-block text-title">R$</span>
                {totalFinalMoneyReal}
                <span className="d-block text-small font-weight-bold">
                    sem mensalidade
                </span>
            </div>
        </section>
    );

    const showDiffDiscount = () =>
        discountDiff && (
            <section className="my-5 zoomIn animated">
                <h2 className="text-purple text-center text-subtitle font-weight-bold m-0">
                    Automatizador de Desconto
                </h2>
                <p className="text-normal text-purple text-left">
                    Você economiza{" "}
                    <span className="text-subtitle font-weight-bold">
                        {discountDiffReal} ({Math.ceil(increasedPerc)}%)
                    </span>{" "}
                    comparado com o preço total de {firstPhasePriceReal}
                    {/*(R$ 0,14 por unidade)*/}
                </p>
            </section>
        );

    const showSummary = () => (
        <section className="invest-brief my-5 zoomIn animated">
            <h2 className="text-center text-subtitle font-weight-bold m-0">
                Resumo de Investimento
            </h2>
            <div className="text-normal text-left">
                ✔ Total de Pacotes:{" "}
                <span className="text-subtitle font-weight-bold">{packs}</span>
                <br />✔ Total de SMS:{" "}
                <span className="text-subtitle font-weight-bold">
                    {totalSMSReal}
                </span>
                <br />✔ Validade:{" "}
                <span className="text-subtitle font-weight-bold">
                    não expira.
                </span>
                <br />✔ Desconto:{" "}
                <span className="text-subtitle font-weight-bold">
                    {discountDiff
                        ? `${discountDiffReal} (${Math.ceil(increasedPerc)}%)`
                        : "nenhum."}
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
                value={packs}
                callback={handlePackages}
                disabled={!!newQuantity}
                needSlideInstru
            />
            {packs <= 230 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardRight}
                >
                    300
                    <br />
                    pacotes
                </div>
            )}

            {packs >= 55 && !newQuantity && (
                <div
                    className="position-absolute font-weight-bold text-shadow text-center"
                    style={styles.delimeterBoardLeft}
                >
                    1<br />
                    pacote
                </div>
            )}
        </section>
    );

    const showQuantityField = () =>
        (packs >= 290 || Boolean(newQuantity)) && (
            <section
                className="animated fadeInUp slow
        my-3 d-flex align-items-center justify-content-end"
            >
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

    return (
        <section className="my-5 mx-4">
            {showSlider()}
            {showQuantityField()}
            {showMultiPrice()}
            {showAutoFinalTotal()}
            {showDiffDiscount()}
            {showSummary()}
        </section>
    );
}
