import React, { useState, useEffect } from "react";
import getInstallments from "../helpers/getInstallments";
import SwitchBtn from "../../../../../../../../components/buttons/material-ui/SwitchBtn";
import convertToReal from "../../../../../../../../utils/numbers/convertToReal";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import handleChange from "../../../../../../../../utils/form/use-state/handleChange";
import { treatBoolStatus } from "../../../../../../../../hooks/api/trigger";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";

export default function BriefAndValue({
    brand,
    amount,
    description,
    PagSeguro,
    setMainData,
    payMethod,
    installmentTotalAmount,
    setCurrComp,
}) {
    const [data, setData] = useState({
        installmentOpts: null,
        selectedInsta: "selecione parcela:",
    });
    const { installmentOpts, selectedInsta } = data;

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

            setMainData((prev) => ({
                ...prev,
                installmentQuantity,
                installmentDesc,
                installmentTotalAmount,
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
                        const instValue = `${
                            inst.quantity
                        } x ${convertToReal(inst.installmentAmount, {
                            moneySign: true,
                        })} ${inst.interestFree ? "(sem juros)" : ""}`;
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

    return (
        <section
            className="position-relative"
            style={{
                marginBottom: "150px",
            }}
        >
            {showEditCardBtn()}
            <p className="text-subtitle text-p font-weight-bold text-center">
                Resumo
            </p>
            <div className="mx-3 my-3">
                <p className="m-0 text-purple text-subtitle text-left">
                    Referente a:{" "}
                </p>
                <div className="text-purple font-weight-bold text-normal text-left">
                    {description &&
                        description.replace(" no valor total de:", ".")}
                </div>
            </div>
            {showPayMethods()}
        </section>
    );
}
