import React, { useState, useEffect } from "react";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useClientAdmin } from "../../../hooks/useRoleData";
import { getVar } from "../../../hooks/storage/useVar";
import { getServiceSKU } from "../../../utils/string/getSKU";
import useAPI, { createDefaultCode } from "../../../hooks/api/useAPI";

const sandboxMode = true;
const payUrl = sandboxMode
    ? "https://stc.sandbox.pagseguro.uol.com.br"
    : "https://stc.pagseguro.uol.com.br";

export default function PayArea({ handleCancel, plan, servicesTotal = 135 }) {
    const [data, setData] = useState({
        SKU: "",
    });
    const { SKU } = data;
    console.log("SKU", SKU);

    const dispatch = useStoreDispatch();

    const { bizCodeName } = useClientAdmin();

    const params = {
        reference: SKU,
        itemId1: SKU,
        itemDescription1: `Plano ${plan} com ${servicesTotal} serviços`,
        itemAmount1: servicesTotal.toFixed(2).toString(),
    };

    const { data: authPayCode } = useAPI({
        method: "post",
        url: createDefaultCode(),
        params,
        trigger: SKU,
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
                <ButtonFab
                    size="large"
                    title="VAMOS LÁ!"
                    position="relative"
                    onClick={() => {
                        handleCancel("noMsg");

                        const callbacks = {
                            success: (transactionCode) =>
                                alert("success - " + transactionCode),
                            abort: () => alert("transaction aborted"),
                        };

                        window.PagSeguroLightbox(
                            {
                                code: authPayCode,
                            },
                            callbacks
                        );
                    }}
                    backgroundColor={"var(--themeSDark)"}
                    variant="extended"
                />
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
