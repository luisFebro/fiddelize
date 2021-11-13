import { Fragment } from "react";
import InstructionBtn from "components/buttons/InstructionBtn";
import { formatDate } from "utils/dates/dateFns";
import usePro from "init/pro";
import ProRenewalBtn from "components/pro/ProRenewalBtn";
import ReportIcon from "@material-ui/icons/Report";
import ActiveItemsBtn from "./active-items-btn/ActiveItemsBtn";

export default function BillingCycleActiveItems() {
    const {
        isPro,
        startDate,
        daysLeft,
        finishDate,
        isProExpBlock1,
        isProExpBlock2,
    } = usePro();

    const startDayMonth = startDate && formatDate(startDate, "dd' 'MMM").cap();
    const finishDayMonth =
        finishDate && formatDate(finishDate, "dd' 'MMM").cap();

    // years
    const startYear = startDate && new Date(startDate).getFullYear();
    const finishYear = finishDate && new Date(finishDate).getFullYear();
    // end years

    const showDates = () => (
        <section
            className="position-relative container-center-col"
            style={{
                top: -10,
            }}
        >
            <section
                className="d-flex justify-content-around"
                style={{
                    width: 300,
                }}
            >
                <div>
                    <strong className="text-subtitle font-weight-bold">
                        {startDayMonth}
                    </strong>
                    <br />
                    {startYear}
                </div>
                <p className="d-flex align-items-center">até</p>
                <div>
                    <strong className="text-subtitle font-weight-bold">
                        {finishDayMonth}
                    </strong>
                    <br />
                    {finishYear}
                </div>
            </section>
            <div className="mt-4">
                <ActiveItemsBtn />
            </div>
        </section>
    );

    const textInstru =
        "A duração do plano é feita baseada no seu último pedido que incluem serviços principais como Novvos Clientes ou Connecta Membros.<br /><br />A data de expiração do ciclo do plano é aquela com duração mais longa.";

    const showPlanStatusMsg = () => (
        <Fragment>
            {isProExpBlock1 || isProExpBlock2 ? (
                <section className="text-grey text-normal text-left mx-3">
                    <p className="my-3 text-center text-subtitle text-red font-weight-bold">
                        seu plano expirou
                    </p>
                    {isProExpBlock1 &&
                        !isProExpBlock2 &&
                        showProExpBlock1({ daysLeft })}
                    {isProExpBlock2 && showProExpBlock2()}
                    <p className="font-italic text-center">
                        Renove para desbloquear recursos
                    </p>
                    <div className="container-center">
                        <ProRenewalBtn title="Renovar plano" width="100%" />
                    </div>
                </section>
            ) : (
                <p className="my-3 text-center text-normal text-grey font-weight-bold">
                    sem plano ativo
                </p>
            )}
        </Fragment>
    );

    return (
        <section className="mb-5 text-normal text-purple text-center">
            {isPro && !isProExpBlock1 ? (
                <Fragment>
                    <p className="container-center">
                        <div className="d-flex">
                            <p className="m-0 mt-3 d-table text-pill">
                                Duração do plano:
                            </p>
                            <div className="ml-3">
                                <InstructionBtn
                                    text={textInstru}
                                    mode="tooltip"
                                    zIndex={0}
                                />
                            </div>
                        </div>
                    </p>
                    {showDates()}
                </Fragment>
            ) : (
                showPlanStatusMsg()
            )}
        </section>
    );
}

function showProExpBlock1({ daysLeft }) {
    return (
        <Fragment>
            <p>
                +1 mês de manutenção foi ativado e termina em{" "}
                <strong>{daysLeft} dias</strong>.
            </p>
            <section>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> ativado expiração de
                    moedas clientes ao final do mês de manutenção
                </p>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> bloqueado cadastro
                    de novos clientes
                    <br />
                    (app admin/membros)
                </p>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> bloqueado cadastro
                    de novos membros
                    <br />
                    (app admin/membros)
                </p>
            </section>
        </Fragment>
    );
}

function showProExpBlock2() {
    return (
        <Fragment>
            <p>
                +1 mês de manutenção <strong>terminou</strong>.
            </p>
            <section>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> todas as moedas dos
                    clientes expiraram.
                </p>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> bloqueado cadastro
                    de novos clientes
                    <br />
                    (app admin/membros)
                </p>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> bloqueado cadastro
                    de novos membros
                    <br />
                    (app admin/membros)
                </p>
                <p>
                    <ReportIcon style={{ fontSize: 25 }} /> bloqueado cadastro
                    de moedas PTS
                    <br />
                    (app admin/membros)
                </p>
            </section>
        </Fragment>
    );
}
