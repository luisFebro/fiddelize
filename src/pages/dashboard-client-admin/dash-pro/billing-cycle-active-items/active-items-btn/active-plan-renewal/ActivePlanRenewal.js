import { Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { withRouter } from "react-router-dom";
import convertToReal from "utils/numbers/convertToReal";
import InstructionBtn from "components/buttons/InstructionBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setProRenewal from "utils/biz/setProRenewal";

function ActivePlanRenewal({
    history,
    mainItemList = [], // the actual raw itemList for order page
    itemList = [], // modified itemList for the table
    loading,
    planBr,
    periodBr,
}) {
    const investAmount = itemList.length
        ? itemList.reduce((acc, next) => acc + next.invAmount, 0)
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
            period: periodBr === "mensal" ? "monthly" : "yearly",
        }).then(() => {
            history.push("/pedidos/admin");
        });
    };

    const showRenewalItemList = () => (
        <section className="text-normal">
            <h2 className="text-subtitle text-center">Novos Créditos</h2>
            {itemList.map((item) => (
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
                para continuar aproveitando seus créditos
            </p>
            <hr className="lazer-purple" />
            <p>
                {checkIcon("check", 25)} Plano atual renovado sai por{" "}
                <span className="text-pill">
                    R$ {convertToReal(investAmount)}
                </span>
            </p>
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
            <div className="mt-5 container-center">
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
function showTooltip({ service = "Novvos Clientes", currCredits, invCredits }) {
    const totalCredits = currCredits + invCredits;
    const txt = `
        <p class="text-center">${service}</p>
        <p>Quantia créditos:</p>
        <p class="m-0">${convertToReal(currCredits)} (atual) + ${convertToReal(
        invCredits
    )} (novo plano)</p>
        <p>fica total de ${convertToReal(totalCredits)} créditos</p>
        <p>você investe apenas pela quantia de ${convertToReal(
            invCredits
        )} créditos do novo plano e acumula os créditos atuais.</p>
    `;

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
                + créditos <span className="text-pill">ilimitados</span>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <span className="text-pill">
                {convertToReal(item.currCredits + item.invCredits)}
            </span>{" "}
            créditos {showTooltip(item)}
        </Fragment>
    );
}
// END HELPERS

export default withRouter(ActivePlanRenewal);
