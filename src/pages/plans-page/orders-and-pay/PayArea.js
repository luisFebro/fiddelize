import { useState, useEffect, Fragment } from "react";
import { readUser } from "api/frequent";
import { Link } from "react-router-dom";
import ButtonMulti from "components/buttons/material-ui/ButtonMulti";
import { setRun, useAction } from "global-data/ui";
import useData, { useBizData } from "init";
import getOnlyNumbersFromStr from "utils/numbers/getOnlyNumbersFromStr";
import convertPhoneStrToInt from "utils/numbers/convertPhoneStrToInt";
import { addDays } from "utils/dates/dateFns";
import getDashYearMonthDay from "utils/dates/getDashYearMonthDay";
import { Load } from "components/code-splitting/LoadableComp";
import convertTextDateToSlashDate from "utils/dates/convertTextDateToSlashDate";
import useStartPagseguro, {
    sandboxMode,
} from "./helpers/pagseguro/useStartPagseguro";
import useStartCheckout from "./helpers/pagseguro/useStartCheckout";

const AsyncPayMethods = Load({
    loader: () =>
        import(
            "./modal-pay/AsyncPayContent" /* webpackChunkName: "direct-pay-comp-lazy" */
        ),
});

export default function PayArea({
    handleCancel,
    reference,
    planBr,
    period = "yearly",
    investAmount,
    itemsCount,
    itemList,
}) {
    const [alreadyReadUser, setAlreadyReadUser] = useState(false); // avoid multiple request calls
    const [data, setData] = useState({
        servDesc: "",
        senderCPF: "",
        senderAreaCode: "",
        senderPhone: "",
        senderBirthday: "", // for credit card
        firstDueDate: "", // for boleto
        referrer: "", // split, to get the associate's public key
    });
    const {
        servDesc,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderBirthday,
        firstDueDate,
        referrer,
    } = data;

    const { bizId, bizLinkName, bizName } = useBizData();
    const { userId, phone, name, firstName, email: senderEmail } = useData();

    const startedPagseguro = useStartPagseguro();
    const { loading, error, ShowError } = useStartCheckout({
        userId,
        trigger: reference && itemsCount && investAmount,
    });

    const uify = useAction();

    useEffect(() => {
        const handlePeriod = () => {
            const gotFullPlan =
                itemList && itemList.some((i) => i.range === "fullPlan");
            if (!gotFullPlan) return "extra";
            if (period === "yearly") return "anual";
            if (period === "monthly") return "mensal";

            return ""; // period === "infinite"
        };

        const desc = `Plano ${planBr} ${handlePeriod()} com ${
            itemsCount || ""
        } serviço${
            itemsCount > 1 ? "s" : ""
        } no valor total de: R$ ${investAmount}`;

        setData((thisData) => ({
            ...thisData,
            servDesc: desc,
        }));
    }, [period, planBr, itemsCount, investAmount]);

    useEffect(() => {
        if (alreadyReadUser) return;
        readUser(userId, "cliente-admin", "cpf birthday referrer").then(
            (res) => {
                setAlreadyReadUser(true);
                const thisReferrer = res.referrer;
                const thisBirthDay = res.birthday;
                const thisCPF = res.cpf;

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
                    senderCPF: thisSenderCPF,
                    senderAreaCode: thisSenderAreaCode,
                    senderPhone: thisSenderPhone,
                    firstDueDate: thisFirstDueDate,
                    senderBirthday: thisSenderBirthday,
                }));
            }
        );
    }, [userId, phone, alreadyReadUser]);

    // converting Infinity Value into string since JSON converted it to null
    if (planBr === "ouro")
        itemList =
            itemList.length &&
            itemList.map((i) => ({
                ...i,
                count: handleInfinity(),
            }));

    const modalData = {
        userId,
        name,
        firstName,
        senderCPF,
        senderBirthday,
        senderAreaCode,
        senderPhone,
        senderEmail,
        reference,
        firstDueDate,
        bizId,
        bizName, // for email alert only
        itemList,
        itemDescription: servDesc,
        itemAmount: Number(investAmount).toFixed(2).toString(),
        sandboxMode,
        handleCancel,
        referrer,
    };

    const showComeBackLaterBtn = () => (
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
            {!loading && startedPagseguro && (
                <Fragment>
                    {!error && <AsyncPayMethods modalData={modalData} />}
                    {showComeBackLaterBtn()}
                </Fragment>
            )}
            {loading && (
                <p
                    className="font-weight-bold text-subtitle text-purple text-center"
                    style={{ margin: "100px 0" }}
                >
                    Preparando provedores...
                </p>
            )}
            {error && <ShowError />}
        </section>
    );
}

function handleInfinity() {
    if (i.count === Infinity) return i.count.toString();
    if (i.count) return i.count;

    return "Infinity"; // in case of null when read from backend JSON request
}
