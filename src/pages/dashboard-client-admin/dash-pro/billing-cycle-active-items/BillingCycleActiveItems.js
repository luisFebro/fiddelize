import { Fragment } from "react";
import InstructionBtn from "components/buttons/InstructionBtn";
import { formatDate } from "utils/dates/dateFns";
import usePro from "init/pro";
import ActiveItemsBtn from "./active-items-btn/ActiveItemsBtn";
import ProRenewalBtn from "components/pro/ProRenewalBtn";

export default function BillingCycleActiveItems() {
    const { isPro, startDate, finishDate, isProExpBlock1 } = usePro();

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
            {isProExpBlock1 ? (
                <section>
                    <p className="my-3 text-center text-normal text-red font-weight-bold">
                        seu plano expirou
                    </p>
                    <div className="container-center">
                        <ProRenewalBtn title="Renovar plano" />
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
