import { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import convertToReal from "utils/numbers/convertToReal";
import { encryptCreditCard } from "utils/security/creditCard";
import handleChange from "utils/form/use-state/handleChange";
import { treatBoolStatus } from "api/trigger";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import getAPI, { removeOneClickInvest } from "api";
import createCardToken, { getValidationData } from "../helpers/createCardToken";
import getSenderHash from "../../../../../helpers/pagseguro/getSenderHash";
import goFinishCheckout from "../../../../../helpers/pagseguro/goFinishCheckout";
import getInstallments, {
    MAX_INSTALLMENT_NO_INTEREST,
} from "../helpers/getInstallments";

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

const getFinalTokens = async ({ cardData }) =>
    await Promise.all([
        getSenderHash().catch((e) => {
            showToast("Erro ao processar transação. Tente reiniciar.", {
                type: "error",
            });
        }),
        createCardToken({ cardData }).catch((e) => {
            if (e.errors["10000"]) {
                return showToast("Marca do cartão Inválido. Edite seu cartão", {
                    type: "error",
                });
            }
            if (e.errors["10001"]) {
                return showToast(
                    "Número do cartão de crédito ou comprimento inválido. Edite seu cartão",
                    { type: "error" }
                );
            }
            if (e.errors["10002"]) {
                return showToast(
                    "Formato da data de expiração do cartão é inválido. Edite seu cartão.",
                    { type: "error" }
                );
            }
            if (e.errors["10003"]) {
                // invalid security field.
                return showToast(
                    "Código de segurança é inválido. Edite seu cartão.",
                    { type: "error" }
                );
            }
            if (e.errors["10004"]) {
                // invalid security field.
                return showToast(
                    "Código CVV/CVC é obrigatório. Edite seu cartão.",
                    { type: "error" }
                );
            }
            if (e.errors["10006"]) {
                return showToast(
                    "Campo de segurança com largura inválida. Edite seu cartão.",
                    { type: "error" }
                );
            }

            showToast(
                "Dados inválidos. Edite o cartão, revise e corrija erros encontrados.",
                { type: "error" }
            );
            console.log(e);
        }),
    ]);

export default function BriefAndValue({
    brand,
    amount,
    description,
    setMainData,
    payMethod,
    installmentTotalAmount,
    setCurrComp,
    mainData,
    modalData,
    isOneClick,
}) {
    const [data, setData] = useState({
        installmentOpts: null,
        selectedInsta: "selecione parcela:",
        loadingInvest: false,
        errorInvest: false,
    });
    const { installmentOpts, selectedInsta, loadingInvest, errorInvest } = data;

    useEffect(() => {
        if (selectedInsta !== "selecione parcela:") {
            // e.g 12 x R$ 120,00
            const firstSpaceInd = selectedInsta.indexOf(" ");
            const installmentQuantity = Number(
                selectedInsta.slice(0, firstSpaceInd)
            );
            const installmentDesc = `parcelado em ${selectedInsta}`;

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
        (async () => {
            const installments = await getInstallments({
                brand,
                amount,
            }).catch((e) => {
                console.log(e);
            });
            if (!installments) return;

            setData((prev) => ({ ...prev, installmentOpts: installments }));
        })();
    }, [brand, amount]);

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

    const handleSwitchOneClickInvest = (res) => {
        const boolSwitch = treatBoolStatus(res);
        if (boolSwitch) {
            setMainData((prev) => ({
                ...prev,
                oneClickInvest: true,
            }));
        } else {
            setMainData((prev) => ({
                ...prev,
                oneClickInvest: false,
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
                defaultStatus
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
            backgroundColor="var(--themeSDark--default)"
            onClick={() => setCurrComp("cardNumber")}
        />
    );

    const handleDeleteCard = () => {
        (async () => {
            await getAPI({
                method: "put",
                url: removeOneClickInvest(modalData.userId),
            });
            await setMainData((prev) => ({
                ...prev,
                isOneClickRemoved: true,
                cardNumber: "",
                cardFullName: "",
                cardVal: "",
                cardCvv: "",
            }));
            setCurrComp("cardNumber");
            showToast("Cartão removido com sucesso.", { type: "success" });
        })();
    };
    const showDeleteCardBtn = () => (
        <ButtonFab
            title="excluir"
            size="small"
            position="absolute"
            left={20}
            top={-60}
            variant="extended"
            backgroundColor="var(--expenseRed)"
            onClick={handleDeleteCard}
        />
    );

    // LESSON: fucking important lesson: watch out for the order of result in the list, they can be misput and sometimes the result be hard to track like finding why the credit token id is returning invalid...
    const handleInvestConclusion = async () => {
        setData({ ...data, loadingInvest: true, errorInvest: false });
        const [senderHash, cardToken] = await getFinalTokens({
            cardData: mainData,
        });
        if (!senderHash || !cardToken) return;

        const { itemAmount, handleCancel } = modalData;

        const encryptedCC = await getEncryptedCC(mainData);

        const dataCheckout = await goFinishCheckout({
            selectedMethod: "creditCard",
            senderHash,
            modalData,
            creditCardToken: cardToken,
            noInterestInstallmentQuantity: MAX_INSTALLMENT_NO_INTEREST,
            installmentTotalAmount, // for installment handling
            installmentQuantity: mainData.installmentQuantity || "1",
            installmentValue: mainData.amountPerInstallment
                ? Number(mainData.amountPerInstallment).toFixed(2).toString()
                : itemAmount,
            installmentDesc: mainData.installmentDesc,
            creditCardHolderName: mainData.cardFullName,
            cc: encryptedCC,
            oneClickInvest: mainData.oneClickInvest,
            brand,
        });

        if (!dataCheckout) {
            setData({ ...data, loadingInvest: false, errorInvest: true });
            return;
        }

        handleCancel(); // remove current orders
        await setData({ ...data, loadingInvest: false });
        await setCurrComp("successfulCCPay");
    };

    const showFinalInvestBtn = () => (
        <section className="my-5 container-center">
            <ButtonFab
                title={`${loadingInvest ? "Carregando..." : "Investir"}`}
                size="large"
                position="relative"
                variant="extended"
                backgroundColor="var(--themeSDark--default)"
                onClick={handleInvestConclusion}
            />
        </section>
    );

    const showOneClickInvest = () =>
        !isOneClick && (
            <section className="my-5 container-center">
                <p className="m-0 text-nowrap text-purple text-subtitle text-left">
                    Investir com 1-clique:
                </p>
                <p className="ml-2 my-3 text-purple text-small font-weight-bold text-left">
                    Seu cartão é criptografado e armazenado com segurança para
                    agilizar seu investimento na próxima vez.
                </p>
                <SwitchBtn
                    titleLeft="desativado"
                    titleRight="ativado"
                    callback={handleSwitchOneClickInvest}
                    defaultStatus={isOneClick || false}
                />
            </section>
        );

    const showError = () => (
        <p className="text-red font-weight-bold text-subtitle mx-3 my-3">
            Um erro ocorreu ao finalizar transação. Tente novamente.
        </p>
    );

    return (
        <section
            className="position-relative"
            style={{
                marginBottom: "150px",
            }}
        >
            {isOneClick ? showDeleteCardBtn() : showEditCardBtn()}
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
                {showOneClickInvest()}
                {errorInvest && showError()}
                {showFinalInvestBtn()}
            </section>
        </section>
    );
}
