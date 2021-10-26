import { useState, useEffect } from "react";
import { readUser } from "api/frequent";
import { Link } from "react-router-dom";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { setRun, useAction } from "global-data/ui";
import useData, { useBizData } from "init";
import getOnlyNumbersFromStr from "../../../utils/numbers/getOnlyNumbersFromStr";
import convertPhoneStrToInt from "../../../utils/numbers/convertPhoneStrToInt";
import { addDays } from "../../../utils/dates/dateFns";
import getDashYearMonthDay from "../../../utils/dates/getDashYearMonthDay";
import { Load } from "../../../components/code-splitting/LoadableComp";
import setProRef from "../../../utils/biz/setProRef";
import useStartPagseguro, {
    sandboxMode,
} from "./helpers/pagseguro/useStartPagseguro";
import useStartCheckout from "./helpers/pagseguro/useStartCheckout";
import convertTextDateToSlashDate from "../../../utils/dates/convertTextDateToSlashDate";

const AsyncPayMethods = Load({
    loader: () =>
        import(
            "./modal-pay/AsyncPayContent" /* webpackChunkName: "direct-pay-comp-lazy" */
        ),
});

export default function PayArea({
    handleCancel,
    plan,
    period = "yearly",
    servicesAmount,
    servicesTotal,
    itemList,
    renewalDaysLeft,
    renewalReference,
    isSingleRenewal,
}) {
    const [alreadyReadUser, setAlreadyReadUser] = useState(false); // avoid multiple request calls
    const [data, setData] = useState({
        SKU: "",
        servDesc: "",
        senderCPF: "",
        senderAreaCode: "",
        senderPhone: "",
        senderBirthday: "", // for credit card
        firstDueDate: "", // for boleto
        referrer: "", // split, to get the associate's public key
    });
    const {
        SKU,
        servDesc,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderBirthday,
        firstDueDate,
        referrer,
    } = data;

    const { bizLinkName, bizName } = useBizData();
    const { userId, phone, name: userName, email: senderEmail } = useData();

    const startedPagseguro = useStartPagseguro();
    const { loading, error, ShowError } = useStartCheckout({
        userId,
        trigger: SKU && servicesTotal && servicesAmount,
    });

    const uify = useAction();

    const handlePeriod = () => {
        if (period === "yearly") return "anual";
        if (period === "monthly") return "mensal";
        return "";
    };

    useEffect(() => {
        if (alreadyReadUser) return;
        readUser(userId, "cliente-admin", "cpf birthday referrer").then(
            (res) => {
                setAlreadyReadUser(true);
                const thisReferrer = res.referrer;
                const thisBirthDay = res.birthday;
                let thisCPF = res.cpf;
                if (thisCPF === "111.111.111-00") thisCPF = "319.683.234-14"; // for testing only

                const desc = `Plano ${plan} ${handlePeriod()} com ${
                    servicesTotal || ""
                } serviço${
                    servicesTotal > 1 ? "s" : ""
                } no valor total de: R$ ${servicesAmount}`;
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

                const thisSenderBirthday = convertTextDateToSlashDate(
                    thisBirthDay
                );

                setData((thisData) => ({
                    ...thisData,
                    referrer: thisReferrer,
                    servDesc: desc,
                    senderCPF: thisSenderCPF,
                    senderAreaCode: thisSenderAreaCode,
                    senderPhone: thisSenderPhone,
                    firstDueDate: thisFirstDueDate,
                    senderBirthday: thisSenderBirthday,
                }));
            }
        );
    }, [plan, servicesTotal, phone, servicesAmount, alreadyReadUser]);

    servicesAmount =
        servicesAmount && Number(servicesAmount).toFixed(2).toString();

    useEffect(() => {
        setProRef({
            setData,
            planBr: plan,
            period,
        });
    }, [plan, period]);

    const modalData = {
        handleCancel,
        sandboxMode,
        reference: SKU,
        itemDescription: servDesc,
        itemAmount: servicesAmount,
        senderCPF,
        senderBirthday,
        senderAreaCode,
        senderPhone,
        senderEmail,
        firstDueDate,
        itemList,
        renewalDaysLeft,
        renewalReference,
        isSingleRenewal,
        bizName, // for email alert only
        referrer,
    };

    const showCTAs = () =>
        !loading &&
        startedPagseguro && (
            <section className="container-center-col">
                <Link
                    to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun("runName", "goDash", uify)}
                >
                    <ButtonMulti
                        title="VOLTAR MAIS TARDE"
                        onClick={null}
                        variant="link"
                        color="var(--themeP)"
                        underline
                        margin="0 16px 50px"
                        zIndex={-1}
                    />
                </Link>
            </section>
        );

    return (
        <section className="my-5">
            {!loading && startedPagseguro && !error && (
                <AsyncPayMethods modalData={modalData} />
            )}
            {showCTAs()}
            {loading && (
                <p
                    className="font-weight-bold text-subtitle text-purple text-center"
                    style={{ margin: "100px 0" }}
                >
                    Preparando tudo...
                </p>
            )}
            {error && <ShowError />}
        </section>
    );
}

/* ARCHIVES
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
 */
