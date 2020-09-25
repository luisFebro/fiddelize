import React, { useState, useEffect } from "react";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useProfile, useClientAdmin } from "../../../hooks/useRoleData";
import { getVar } from "../../../hooks/storage/useVar";
import { getServiceSKU } from "../../../utils/string/getSKUCode.js";
import useAPI, { startCheckout } from "../../../hooks/api/useAPI";
import PayBtn from "./modal-pay/PayBtn";
import getOnlyNumbersFromStr from "../../../utils/numbers/getOnlyNumbersFromStr";
import convertPhoneStrToInt from "../../../utils/numbers/convertPhoneStrToInt";
import convertToReal from "../../../utils/numbers/convertToReal";

const sandboxMode = true;
const payUrl = sandboxMode
    ? "https://stc.sandbox.pagseguro.uol.com.br"
    : "https://stc.pagseguro.uol.com.br";

export default function PayArea({
    handleCancel,
    plan,
    servicesAmount,
    servicesTotal,
}) {
    const [data, setData] = useState({
        SKU: "",
        servDesc: "",
        senderCPF: "",
        senderAreaCode: "",
        senderPhone: "",
    });
    let { SKU, servDesc, senderCPF, senderAreaCode, senderPhone } = data;

    const { bizCodeName } = useClientAdmin();
    const { _id, phone, name: userName, email: senderEmail } = useProfile();

    useEffect(() => {
        let desc = `Plano ${plan} com ${
            servicesTotal ? servicesTotal : ""
        } serviços no valor total de: `;
        // if(servicesTotal > planServiceTotal) {
        //     const leftover = serviceTotal - planServiceTotal;
        //     desc = `Plano ${plan} com ${planServiceTotal} serviços + ${leftover} outros serviços no valor total de: `
        // }
        const thisSenderCPF = getOnlyNumbersFromStr("023.248.892-42");
        const thisSenderAreaCode = convertPhoneStrToInt(phone, {
            dddOnly: true,
        });
        const thisSenderPhone = convertPhoneStrToInt(phone, {
            phoneOnly: true,
        });

        setData({
            ...data,
            servDesc: desc,
            senderCPF: thisSenderCPF,
            senderAreaCode: thisSenderAreaCode,
            senderPhone: thisSenderPhone,
        });
    }, [plan, servicesTotal, phone, servicesAmount]);

    servicesAmount =
        servicesAmount && Number(servicesAmount).toFixed(2).toString();

    const dispatch = useStoreDispatch();

    const { data: authToken, loading, error, ShowError } = useAPI({
        method: "post",
        url: startCheckout(),
        params: { userId: _id },
        trigger: SKU && servicesTotal && servicesAmount,
        needAuth: true,
    });

    useEffect(() => {
        getVar("totalServices_clientAdmin").then((totalServ) => {
            const thisCode = getServiceSKU({ plan, total: totalServ });
            // if you want to access data inside of a promise, use innerData, never external data because it returns undefined.
            setData((innerData) => ({ ...innerData, SKU: thisCode }));
        });
    }, [plan]);

    useEffect(() => {
        const script = document.createElement("script");

        script.type = "text/javascript";
        script.src = `${payUrl}/pagseguro/api/v2/checkout/pagseguro.directpayment.js`;
        script.async = true;
        script.crossorigin = "anonymous";

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const modalData = {
        sandboxMode,
        authToken,
        reference: SKU,
        itemDescription: servDesc,
        itemAmount: servicesAmount,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail,
        PagSeguro: window.PagSeguroDirectPayment,
    };

    return (
        <section className="my-5">
            <p
                className="mb-5 text-center text-purple text-subtitle font-weight-bold"
                style={{ lineHeight: "35px" }}
            >
                Pronto para fazer
                <br />
                parte do <span className="text-pill">clube pro</span>
                <br />
                da Fiddelize?
            </p>
            <section className="container-center-col">
                {authToken && (
                    <PayBtn
                        size="large"
                        title="VAMOS LÁ!"
                        position="relative"
                        modalData={modalData}
                        callback={() => {
                            handleCancel("noMsg");
                            const callbacks = {
                                success: (transactionCode) =>
                                    alert("success - " + transactionCode),
                                abort: () => {
                                    console.log("EVENT: transaction aborted");
                                },
                            };

                            // window.PagSeguroLightbox(authToken, callbacks);
                        }}
                        backgroundColor={"var(--themeSDark)"}
                        variant="extended"
                    />
                )}
                {loading && (
                    <p className="font-weight-bold text-normal text-purple text-center">
                        Preparando tudo...
                    </p>
                )}
                {error && <ShowError />}
                <Link
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <ButtonMulti
                        title="VOLTAR MAIS TARDE"
                        onClick={null}
                        variant="link"
                        color="var(--themeP)"
                        underline={true}
                    />
                </Link>
            </section>
        </section>
    );
}
