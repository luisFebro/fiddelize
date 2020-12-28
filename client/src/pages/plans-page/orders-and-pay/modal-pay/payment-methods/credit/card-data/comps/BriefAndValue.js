import React, { useState, useEffect } from "react";
import getInstallments from "../helpers/getInstallments";
import SwitchBtn from "../../../../../../../../components/buttons/material-ui/SwitchBtn";
import convertToReal from "../../../../../../../../utils/numbers/convertToReal";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import handleChange from "../../../../../../../../utils/form/use-state/handleChange";
import { treatBoolStatus } from "../../../../../../../../hooks/api/trigger";

export default function BriefAndValue({
    brand,
    amount,
    description,
    PagSeguro,
    setMainData,
    payMethod,
}) {
    const [data, setData] = useState({
        installmentOpts: null,
        selected: "selecione parcelas:",
    });
    const { installmentOpts, selected } = data;

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
        <section className="container-center">
            <Select
                margin="dense"
                onChange={handleChange(setData, data)}
                name="selected"
                value={selected}
                variant="outlined"
                error={false}
            >
                <MenuItem value={selected}>
                    <span
                        className="text-p text-normal"
                        style={{
                            fontSize: "1.2em",
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        selecione parcelas:
                    </span>
                </MenuItem>
                {installmentOpts &&
                    installmentOpts.map((inst, ind) => {
                        const instValue = `${inst.quantity} x ${
                            inst.installmentAmount
                        } ${inst.interestFree ? "(sem juros)" : ""}`;
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
            Valor total:{" "}
            <span className="text-pill">
                {amount && convertToReal(amount, { moneySign: true })}
            </span>
        </section>
    );

    return (
        <section>
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
            {JSON.stringify(installmentOpts)}
        </section>
    );
}
