import React, { useState, useEffect, Fragment } from "react";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useProfile, useClientAdmin } from "../../../hooks/useRoleData";
import useAPI, { startCheckout, getProData } from "../../../hooks/api/useAPI";
import PayBtn from "./modal-pay/PayBtn";
import getOnlyNumbersFromStr from "../../../utils/numbers/getOnlyNumbersFromStr";
import convertPhoneStrToInt from "../../../utils/numbers/convertPhoneStrToInt";
import convertToReal from "../../../utils/numbers/convertToReal";
import { addDays } from "../../../utils/dates/dateFns";
import getDashYearMonthDay from "../../../utils/dates/getDashYearMonthDay";
import { readUser } from "../../../redux/actions/userActions";
import { Load } from "../../../components/code-splitting/LoadableComp";
import setProRef from "../../../utils/biz/setProRef";
import { IS_DEV } from "../../../config/clientUrl";

const AsyncPayMethods = Load({
    loader: () =>
        import(
            "./modal-pay/AsyncPayContent" /* webpackChunkName: "direct-pay-comp-lazy" */
        ),
});

const sandboxMode = IS_DEV ? true : false;
const payUrl = sandboxMode
    ? "https://stc.sandbox.pagseguro.uol.com.br"
    : "https://stc.pagseguro.uol.com.br";

export default function PayArea({
    handleCancel,
    plan,
    period = "yearly",
    servicesAmount,
    servicesTotal,
    ordersStatement,
    renewalDaysLeft,
    renewalReference,
    isSingleRenewal,
}) {
    const [data, setData] = useState({
        SKU: "",
        servDesc: "",
        senderCPF: "",
        senderAreaCode: "",
        senderPhone: "",
        firstDueDate: "",
        isUserPro: false,
    });
    let {
        SKU,
        servDesc,
        senderCPF,
        senderAreaCode,
        senderPhone,
        firstDueDate,
        // isUserPro,
    } = data;

    const { bizCodeName } = useClientAdmin();
    const { _id, phone, name: userName, email: senderEmail } = useProfile();
    const { data: dataPro, loading: proLoading } = useAPI({
        url: getProData(_id),
        dataName: "proData",
    });

    const isUserPro = !proLoading && dataPro && dataPro.isPro;

    const dispatch = useStoreDispatch();

    const handlePeriod = () => {
        if (period === "yearly") return "anual";
        if (period === "monthly") return "mensal";
        return "";
    };

    useEffect(() => {
        readUser(dispatch, _id, {
            select: "cpf -_id",
            role: "cliente-admin",
        }).then((res) => {
            let thisCPF = res.data.cpf;
            if (thisCPF === "111.111.111-11") thisCPF = "431.711.242-62"; // for testing only

            let desc = `Plano ${plan} ${handlePeriod()} com ${
                servicesTotal ? servicesTotal : ""
            } serviço${servicesTotal > 1 ? "s" : ""} no valor total de: `;
            // if(servicesTotal > planServiceTotal) {
            //     const leftover = serviceTotal - planServiceTotal;
            //     desc = `Plano ${plan} com ${planServiceTotal} serviços + ${leftover} outros serviços no valor total de: `
            // }
            const thisSenderCPF = getOnlyNumbersFromStr(thisCPF);
            const thisSenderAreaCode = convertPhoneStrToInt(phone, {
                dddOnly: true,
            });
            const thisSenderPhone = convertPhoneStrToInt(phone, {
                phoneOnly: true,
            });
            const thisFirstDueDate = getDashYearMonthDay(
                addDays(new Date(), 3)
            );

            setData((thisData) => ({
                ...thisData,
                servDesc: desc,
                senderCPF: thisSenderCPF,
                senderAreaCode: thisSenderAreaCode,
                senderPhone: thisSenderPhone,
                firstDueDate: thisFirstDueDate,
            }));
        });
    }, [plan, servicesTotal, phone, servicesAmount]);

    servicesAmount =
        servicesAmount && Number(servicesAmount).toFixed(2).toString();

    const { data: authToken, loading, error, ShowError } = useAPI({
        method: "post",
        url: startCheckout(),
        params: { userId: _id },
        trigger: SKU && servicesTotal && servicesAmount,
        needAuth: true,
        timeout: 30000,
    });

    useEffect(() => {
        setProRef({
            setData,
            planBr: plan,
            period,
        });
    }, [plan, period]);

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
        handleCancel,
        sandboxMode,
        authToken,
        reference: SKU,
        itemDescription: servDesc,
        itemAmount: servicesAmount,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail,
        firstDueDate,
        ordersStatement,
        PagSeguro: window.PagSeguroDirectPayment,
        renewalDaysLeft,
        renewalReference,
        isSingleRenewal,
    };

    const showDirectPayAreaToPros = () =>
        !loading && <AsyncPayMethods modalData={modalData} isProUser={true} />;

    const showUnpaidUsersMsg = () => (
        <Fragment>
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
        </Fragment>
    );

    const showCTAs = () =>
        !loading && (
            <section className="container-center-col">
                {authToken && !isUserPro && (
                    <PayBtn
                        size="large"
                        title="VAMOS LÁ!"
                        position="relative"
                        modalData={modalData}
                        callback={() => {
                            handleCancel();
                        }}
                        backgroundColor={"var(--themeSDark)"}
                        variant="extended"
                    />
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
                        margin={isUserPro ? "0 16px 50px" : undefined}
                        zIndex={-1}
                    />
                </Link>
            </section>
        );

    return (
        <section className="my-5">
            {isUserPro && !proLoading && showDirectPayAreaToPros()}
            {!isUserPro && !proLoading && showUnpaidUsersMsg()}
            {showCTAs()}
            {loading && !proLoading && (
                <p className="font-weight-bold text-subtitle text-purple text-center">
                    Preparando tudo...
                </p>
            )}
            {error && <ShowError />}
        </section>
    );
}

/*
<p className="text-break text-normal mx-2">
    {JSON.stringify(authToken)}
</p>
 */
