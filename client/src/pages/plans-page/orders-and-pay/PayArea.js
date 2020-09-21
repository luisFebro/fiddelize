import React, { useState, useEffect } from "react";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useProfile, useClientAdmin } from "../../../hooks/useRoleData";
import { getVar } from "../../../hooks/storage/useVar";
import { getServiceSKU } from "../../../utils/string/getSKU";
import useAPI, { createDefaultCode } from "../../../hooks/api/useAPI";

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
    });

    let { SKU } = data;

    servicesAmount =
        servicesAmount && Number(servicesAmount).toFixed(2).toString();

    const dispatch = useStoreDispatch();

    const { bizCodeName } = useClientAdmin();
    const { name: userName, email: userEmail } = useProfile();

    const params = {
        reference: SKU,
        itemId1: SKU,
        itemDescription1: `Plano ${plan} com ${servicesTotal} servicos`,
        itemAmount1: servicesAmount,
        extraAmount: undefined, // ex -30.00 for discount coupon system
        senderCPF: "02324889242",
        senderAreaCode: 92,
        senderPhone: "992817363",
        senderName: userName,
        senderEmail: "ana@gmail.com",
        redirectURL: "http://localhost:3000/planos?cliente-admin=1",
    };

    const { data: authPayCode } = useAPI({
        method: "post",
        url: createDefaultCode(),
        params,
        trigger: SKU && servicesTotal && servicesAmount,
    });
    console.log("authPayCode", authPayCode);

    useEffect(() => {
        getVar("totalServices_clientAdmin").then((totalServ) => {
            const thisCode = getServiceSKU({ plan, total: totalServ });
            setData({ ...data, SKU: thisCode });
        });
    }, [plan]);

    useEffect(() => {
        // WARNING: LIGHTBOX does not work for mobile, only desktop;
        const script = document.createElement("script");

        script.type = "text/javascript";
        script.src = `${payUrl}/pagseguro/api/v2/checkout/pagseguro.lightbox.js`;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

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
                {authPayCode ? (
                    <ButtonFab
                        size="large"
                        title="VAMOS LÁ!"
                        position="relative"
                        onClick={() => {
                            handleCancel("noMsg");
                            const callbacks = {
                                success: (transactionCode) =>
                                    alert("success - " + transactionCode),
                                abort: () => {
                                    console.log("EVENT: transaction aborted");
                                },
                            };

                            window.PagSeguroLightbox(
                                { code: authPayCode },
                                callbacks
                            );
                        }}
                        backgroundColor={"var(--themeSDark)"}
                        variant="extended"
                    />
                ) : (
                    <p className="font-weight-bold text-normal text-purple text-center">
                        Preparando tudo...
                    </p>
                )}
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
