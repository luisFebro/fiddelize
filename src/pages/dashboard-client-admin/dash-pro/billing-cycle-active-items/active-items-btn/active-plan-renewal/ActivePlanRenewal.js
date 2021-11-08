import { Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { withRouter } from "react-router-dom";
import convertToReal from "utils/numbers/convertToReal";
import InstructionBtn from "components/buttons/InstructionBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setProRenewal from "utils/biz/setProRenewal";
import { formatDate } from "utils/dates/dateFns";

function ActivePlanRenewal({
    history,
    mainRef,
    mainItemList = [], // the actual raw itemList for order page
    tableItemList = [], // modified itemList for the table
    loading,
    planBr,
    periodBr,
    dataPro,
}) {
    const investAmount = mainItemList.length
        ? mainItemList.reduce((acc, next) => acc + next.amount, 0)
        : 0;
    const isGold = planBr === "ouro";
    const newPeriod = periodBr === "mensal" ? "+ 1 mês" : "+ 1 ano";
    const isExtraFreeMonth =
        (planBr === "ouro" || planBr === "prata") && periodBr === "anual";

    const handleActiveRenewal = () => {
        if (loading) return null;

        setProRenewal({
            itemList: mainItemList,
            planBr,
            investAmount,
            // here does require I since it is always monthly or yearly
            period: periodBr === "mensal" ? "monthly" : "yearly",
        }).then(() => {
            history.push("/pedidos/admin");
        });
    };

    const showRenewalItemList = () => (
        <section className="text-normal">
            <h2 className="text-subtitle text-center">Novos Créditos</h2>
            {tableItemList.map((item) => (
                <div key={item.service} className="text-normal text-left">
                    <p className="m-0 font-weight-bold">
                        {checkIcon()} {item.service}:
                    </p>
                    <p className="mb-3">
                        {getNewCredits({ isGold, item })}
                        <br />
                        por R$ {convertToReal(item.invAmount)}
                    </p>
                </div>
            ))}
            <h2 className="text-subtitle text-center">Mais tempo de uso</h2>
            <p>
                <span className="text-pill">{`${newPeriod} ${
                    isExtraFreeMonth ? " e 1 mês extra" : ""
                }`}</span>{" "}
                para continuar aproveitando seu plano
            </p>
            <hr className="lazer-purple" />
            <p>
                {checkIcon("check", 25)} ID plano principal atual:
                <span className="d-table text-pill">{mainRef}</span>
            </p>
            <p>
                {checkIcon("check", 25)} Plano atual renovado sai por{" "}
                <span className="text-pill">
                    R$ {convertToReal(investAmount)}
                </span>
            </p>
        </section>
    );

    const showExpirationInfo = () => (
        <section
            className="position-relative text-normal text-center line-height-30"
            style={{
                top: -25,
            }}
        >
            Seu plano{" "}
            <strong className="text-pill">
                {planBr && planBr.cap()} {periodBr}
            </strong>
            <br />
            termina em <strong>{handleExpiringDate(dataPro)}</strong>
        </section>
    );

    return (
        <section className="mx-3 text-purple text-normal">
            <h2 className="text-center text-subtitle">
                <span className="font-weight-bold">Renovação</span>
                <p className="text-purple font-site text-em-0-8">
                    Ao renovar seu plano atual, fica assim:
                </p>
            </h2>
            {showRenewalItemList()}
            <div
                style={{
                    margin: "70px 0 20px",
                }}
            >
                {showExpirationInfo()}
            </div>
            <div className="container-center">
                <ButtonFab
                    title="Renovar Plano"
                    backgroundColor="var(--themeSDark)"
                    onClick={handleActiveRenewal}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );
}

// HELPERS
function showTooltip({
    creditTypeBr,
    service = "Novvos Clientes",
    currCredits,
    invCredits,
}) {
    const getTooltipTxt = () => {
        if (creditTypeBr === "acumulativo")
            return `
            <p class="text-center">${service}</p>
            <p>você investe apenas pela quantia de ${convertToReal(
                invCredits
            )} créditos do novo plano e acumula com os créditos atuais.</p>
        `;

        if (creditTypeBr === "fixo")
            return `
            <p class="text-center">${service}</p>
            <p>o valor de ${convertToReal(
                currCredits
            )} créditos é fixo e não acumula. Renovando, os membros da sua equipe continuam conectados usando todas as funcionalidades principais do app: cadastrar moedas, clientes e benefícios</p>
        `;

        return "";
    };

    const txt = getTooltipTxt();

    return (
        <span className="ml-3 d-inline-block">
            <InstructionBtn text={txt} mode="tooltip" />
        </span>
    );
}

function checkIcon(icon = "circle", fontSize = 15) {
    return <FontAwesomeIcon icon={icon} style={{ fontSize }} />;
}

function getNewCredits({ isGold, item }) {
    if (isGold) {
        return (
            <Fragment>
                créditos <span className="text-pill">ilimitados</span>
            </Fragment>
        );
    }

    const isAccumulative = item.creditTypeBr === "acumulativo";
    const isFixed = item.creditTypeBr === "fixo";

    return (
        <Fragment>
            <span className="text-pill">
                {isFixed ? "até " : ""}{" "}
                {convertToReal(
                    isAccumulative
                        ? item.currCredits + item.invCredits
                        : item.currCredits
                )}
            </span>{" "}
            créditos {showTooltip(item)}
        </Fragment>
    );
}

// the clients are pro when using this comp, no need isPro to verify
function handleExpiringDate(dataPro) {
    const { daysLeft, finishDate } = dataPro;

    const needCountDown = daysLeft <= 15;
    if (needCountDown) return `${daysLeft} dias`;

    const needYear = daysLeft >= 300;
    const fullFinishDate = formatDate(
        finishDate,
        `dd' 'MMM${needYear ? "', 'yyyy" : ""}`
    );

    return fullFinishDate && fullFinishDate.cap();
}
// END HELPERS

export default withRouter(ActivePlanRenewal);
