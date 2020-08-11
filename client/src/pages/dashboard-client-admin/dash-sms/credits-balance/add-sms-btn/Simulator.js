import React, { useState, useEffect } from 'react';
import convertToReal from '../../../../../utils/numbers/convertToReal';
import MuSlider from '../../../../../components/sliders/MuSlider';

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    sms: {
        top: isSmall ? '50px' : '70px',
        left: '10px'
    },
    totalSMS: {
        fontWeight: 'normal',
    },
    delimeterBoardLeft: {
        top: -45,
        left: -20,
        backgroundColor: 'grey',
        color: '#fff',
        padding: '5px 8px',
        borderRadius: '30%',
        lineHeight: '18px',
    },
    delimeterBoardRight: {
        top: -45,
        right: -20,
        backgroundColor: 'grey',
        color: '#fff',
        padding: '5px 8px',
        borderRadius: '30%',
        lineHeight: '18px',
    }
});

const getSMSData = packages => {
    // unit, expires, unitSizeDec, unitSizeInc
    if(packages < 10) return [0.14, null, "1-1", "1-1"];
    if(packages >= 10 && packages < 100) return [0.12, null, "1", "1-2"];
    if(packages >= 100 && packages < 500) return [0.10, null, "0-9", "1-3"];
    if(packages >= 500 && packages < 1000) return [0.09, null, "0-8", "1-4"];
    if(packages >= 1000) return [0.08, null, "0-6", "1-5"];
}

const getIncreasedPercentage = (startingVal, finalVal) => {
    const diff = finalVal - startingVal;
    const division = diff / startingVal;
    return division * 100;
}

export default function Simulator({ handleData }) {
    const [packages, setPackages] = useState(1);
    const [discountDiff, setDiscountDiff] = useState(null);
    const [increasedPerc, setIncreasedPerc] = useState(null);

    const [unit, expires, unitSizeDec, unitSizeInc] = getSMSData(packages)

    const handlePackages = (newValue) => {
        setPackages(newValue);
    }

    const styles = getStyles();

    const oneSMSPackage = 200;
    const totalSMS = (oneSMSPackage * packages);
    const smsUnit = unit;
    const totalFinalMoney = (totalSMS * smsUnit);
    const firstPhasePrice = (totalSMS * 0.14);

    const totalSMSReal = convertToReal(totalSMS);
    const smsUnitReal = convertToReal(smsUnit, { moneySign: true, needFraction: true })
    const totalFinalMoneyReal = convertToReal(totalFinalMoney);
    const discountDiffReal = convertToReal(discountDiff, { moneySign: true })
    const firstPhasePriceReal = convertToReal(firstPhasePrice, { moneySign: true });

    useEffect(() => {
        handleData({
            totalPackage: packages,
            totalSMS,
            inv: parseInt(totalFinalMoney.toFixed(2)),
        })

    }, [packages])

    useEffect(() => {
        if(unit !== 0.14) {
            const diff = firstPhasePrice - totalFinalMoney
            const incPerc = getIncreasedPercentage(totalFinalMoney, firstPhasePrice);
            setDiscountDiff(diff);
            setIncreasedPerc(incPerc);
        } else {
            setDiscountDiff(null);
        }
    }, [unit, firstPhasePrice])

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
                <span className={`text-em-${unitSizeDec} font-site ${(unit === 0.08 || unit === 0.09) ? "font-weight-bold" : ""}`}>
                    {smsUnitReal}
                </span>
            </span>
        </section>
    );

    const showAutoFinalTotal = () => (
        <section className="mt-2 mb-5 text-hero text-purple text-center">
            <span
                className="d-inline-block text-title"
            >R$</span>
            {totalFinalMoneyReal}
        </section>
    );

    const showDiffDiscount = () => (
        discountDiff &&
        <section className="my-5 zoomIn animated">
            <h2 className="text-purple text-center text-subtitle font-weight-bold m-0">
                Automatizador de Desconto
            </h2>
            <p className="text-normal text-purple text-left">
                Você economiza <span className="text-subtitle font-weight-bold">{discountDiffReal} ({Math.ceil(increasedPerc)}%)</span> comparado com o preço total de {firstPhasePriceReal} (R$ 0,14 por unidade);
            </p>
        </section>
    );

    const showSummary = () => (
        <section className="my-5 zoomIn animated">
            <h2 className="text-purple text-center text-subtitle font-weight-bold m-0">
                Resumo de Investimento
            </h2>
            <div className="text-normal text-left text-purple">
                ✔ Total de Pacotes: <span className="text-subtitle font-weight-bold">{packages}</span>
                <br />
                ✔ Total de SMS: <span className="text-subtitle font-weight-bold">{totalSMSReal}</span>
                <br />
                ✔ Validade: <span className="text-subtitle font-weight-bold">não expira.</span>
                <br />
                ✔ Desconto: <span className="text-subtitle font-weight-bold">{discountDiff ? `${discountDiffReal} (${Math.ceil(increasedPerc)}%)` : "nenhum."}</span>
                <br />
                ✔ Valor a investir: <span className="text-subtitle font-weight-bold">R$ {totalFinalMoneyReal}</span>
            </div>
        </section>
    );

    return (
        <section className="my-5 mx-4">
            <section className="position-relative">
                <MuSlider
                    color="var(--themeP)"
                    value={packages}
                    callback={handlePackages}
                />
                {packages <= 240 && (
                    <div
                        className="position-absolute font-weight-bold text-shadow text-center"
                        style={styles.delimeterBoardRight}
                    >
                        300<br />pacotes
                    </div>
                )}

                {packages >= 55 && (
                    <div
                        className="position-absolute font-weight-bold text-shadow text-center"
                        style={styles.delimeterBoardLeft}
                    >
                        1<br />pacote
                    </div>
                )}
            </section>
            {showMultiPrice()}
            {showAutoFinalTotal()}
            {showDiffDiscount()}
            {showSummary()}
        </section>
    );
}