import React, { useState, useEffect } from "react";
import getInstallments from "../helpers/getInstallments";
import SwitchBtn from "../../../../../../../../components/buttons/material-ui/SwitchBtn";
import convertToReal from "../../../../../../../../utils/numbers/convertToReal";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import handleChange from "../../../../../../../../utils/form/use-state/handleChange";
import { treatBoolStatus } from "../../../../../../../../hooks/api/trigger";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import createCardToken, { getValidationData } from "../helpers/createCardToken";
import { showSnackbar } from "../../../../../../../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import getSenderHash from "../../../../../helpers/pagseguro/getSenderHash";
import { encryptCreditCard } from "../../../../../../../../utils/security/creditCard";

const getEncryptedCC = async (mainData) => {
    const { month: expirationMonth, year: expirationYear } = getValidationData(
        mainData.cardVal
    );
    const cardData = {
        cardNumber: mainData.cardNumber,
        cvv: mainData.cardCvv,
        expirationYear,
        expirationMonth,
        cardHolder: mainData.cardFullName,
    };

    return await encryptCreditCard(cardData).catch((err) => {
        console.log(err);
    });
};

const getFinalTokens = async ({ cardData, dispatch }) => {
    return await Promise.all([
        getSenderHash().catch((e) => {
            showSnackbar(
                dispatch,
                "Erro ao processar transação. Tente reiniciar.",
                "error"
            );
        }),
        createCardToken({ cardData }).catch((e) => {
            if (e.errors["10000"]) {
                return showSnackbar(
                    dispatch,
                    "Marca do cartão Inválido. Edite seu cartão",
                    "error"
                );
            }
            if (e.errors["10001"]) {
                return showSnackbar(
                    dispatch,
                    "Número do cartão de crédito ou comprimento inválido. Edite seu cartão",
                    "error"
                );
            }
            if (e.errors["10002"]) {
                return showSnackbar(
                    dispatch,
                    "Formato da data de expiração do cartão é inválido. Edite seu cartão.",
                    "error"
                );
            }
            if (e.errors["10003"]) {
                //invalid security field.
                return showSnackbar(
                    dispatch,
                    "Código de segurança é inválido. Edite seu cartão.",
                    "error"
                );
            }
            if (e.errors["10004"]) {
                //invalid security field.
                return showSnackbar(
                    dispatch,
                    "Código CVV/CVC é obrigatório. Edite seu cartão.",
                    "error"
                );
            }
            if (e.errors["10006"]) {
                return showSnackbar(
                    dispatch,
                    "Campo de segurança com largura inválida. Edite seu cartão.",
                    "error"
                );
            }

            showSnackbar(
                dispatch,
                "Dados inválidos. Edite o cartão, revise e corrija erros encontrados.",
                "error"
            );
            console.log(e);
        }),
    ]);
};

export default function BriefAndValue({
    brand,
    amount,
    description,
    PagSeguro,
    setMainData,
    payMethod,
    installmentTotalAmount,
    setCurrComp,
    mainData,
    modalData,
}) {
    const [data, setData] = useState({
        installmentOpts: null,
        selectedInsta: "selecione parcela:",
    });
    const { installmentOpts, selectedInsta } = data;

    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (selectedInsta !== "selecione parcela:") {
            // e.g 12 x R$ 120,00
            const firstSpaceInd = selectedInsta.indexOf(" ");
            const installmentQuantity = Number(
                selectedInsta.slice(0, firstSpaceInd)
            );
            const installmentDesc = selectedInsta;

            const indInsta = installmentQuantity - 2; // e.g it is started by 2 instalments, then the first is 0 in the array.
            const installmentTotalAmount =
                installmentOpts[indInsta].totalAmount;
            const amountPerInstallment =
                installmentOpts[indInsta].installmentAmount;

            setMainData((prev) => ({
                ...prev,
                installmentQuantity,
                installmentDesc,
                installmentTotalAmount,
                amountPerInstallment,
            }));
        }
    }, [selectedInsta]);

    useEffect(() => {
        if (brand && amount && PagSeguro) {
            (async () => {
                const installments = await getInstallments({
                    brand,
                    amount,
                    PagSeguro,
                }).catch((e) => {
                    console.log(e);
                });
                if (!installments) return;

                setData((prev) => ({ ...prev, installmentOpts: installments }));
            })();
        }
    }, [brand, amount, PagSeguro]);

    const handleSwitch = (res) => {
        const boolSwitch = treatBoolStatus(res);
        if (!boolSwitch) {
            setMainData((prev) => ({
                ...prev,
                payMethod: "installment",
            }));
        } else {
            setMainData((prev) => ({
                ...prev,
                payMethod: "cash",
            }));
        }
    };

    const displayInstallmentSelect = () => (
        <section className="my-3 container-center">
            <Select
                margin="dense"
                onChange={handleChange(setData, data)}
                name="selectedInsta"
                value={selectedInsta}
                variant="outlined"
                error={false}
                style={{ backgroundColor: "#fff" }}
            >
                <MenuItem value={selectedInsta}>
                    <span
                        className="text-p text-normal"
                        style={{
                            fontSize: "1.2em",
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        selecione parcela:
                    </span>
                </MenuItem>
                {installmentOpts &&
                    installmentOpts.map((inst, ind) => {
                        const instValue = `${inst.quantity} x ${convertToReal(
                            inst.installmentAmount,
                            {
                                moneySign: true,
                            }
                        )} ${inst.interestFree ? "(sem juros)" : ""}`;
                        return (
                            <MenuItem key={ind} value={instValue}>
                                {instValue}
                            </MenuItem>
                        );
                    })}
            </Select>
        </section>
    );

    const showPayMethods = () => (
        <section className="mb-1 text-normal font-weight-bold text-center text-p">
            <p className="m-3 text-p text-subtitle text-left">
                Forma de Pagamento:
            </p>
            <SwitchBtn
                titleLeft="parcelado"
                titleRight="à vista"
                callback={handleSwitch}
                defaultStatus={true}
            />
            {payMethod === "installment" && displayInstallmentSelect()}
            Valor total {installmentTotalAmount && "parcelado"}:{" "}
            <span className="text-pill">
                {convertToReal(installmentTotalAmount || amount, {
                    moneySign: true,
                })}
            </span>
        </section>
    );

    const showEditCardBtn = () => (
        <ButtonFab
            title="editar cartão"
            size="small"
            position="absolute"
            left={20}
            top={-60}
            variant="extended"
            backgroundColor={`var(--themeSDark--default)`}
            onClick={() => setCurrComp("cardNumber")}
        />
    );

    // LESSON: fucking important lesson: watch out for the order of result in the list, they can be misput and sometimes the result be hard to track like finding why the credit token id is returning invalid...
    const handleInvestConclusion = async () => {
        showSnackbar(dispatch, "Processando. Um momento...");
        const [senderHash, cardToken] = await getFinalTokens({
            cardData: mainData,
            dispatch,
        });
        if (!senderHash || !cardToken) return;

        const { handleDataMethod, itemAmount } = modalData;

        const encryptedCC = await getEncryptedCC(mainData);
        console.log("encryptedCC", encryptedCC);

        handleDataMethod({
            selectedMethod: "creditCard",
            senderHash,
            creditCardToken: cardToken,
            installmentQuantity: mainData.installmentQuantity || "1",
            installmentValue: mainData.amountPerInstallment
                ? Number(mainData.amountPerInstallment).toFixed(2).toString()
                : itemAmount,
            creditCardHolderName: mainData.cardFullName,
            cc: encryptedCC,
        });
    };

    const showFinalInvestBtn = () => (
        <section className="my-5 container-center">
            <ButtonFab
                title="Investir"
                size="large"
                position="relative"
                variant="extended"
                backgroundColor={`var(--themeSDark--default)`}
                onClick={handleInvestConclusion}
            />
        </section>
    );

    return (
        <section
            className="position-relative"
            style={{
                marginBottom: "150px",
            }}
        >
            {showEditCardBtn()}
            <section className="animated fadeInUp">
                <p className="text-subtitle text-p font-weight-bold text-center">
                    Resumo
                </p>
                <div className="mx-3 my-3">
                    <p className="m-0 text-purple text-subtitle text-left">
                        Referente a:{" "}
                    </p>
                    <div className="text-purple font-weight-bold text-normal text-left">
                        {description &&
                            description
                                .replace(" no valor total de:", ".")
                                .replace("null", "pro")}
                    </div>
                </div>
                {showPayMethods()}
                {showFinalInvestBtn()}
            </section>
        </section>
    );
}
