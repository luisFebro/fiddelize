import { Fragment, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import useData from "../../../../hooks/useData";
import getBizSplitProportion from "../../../../utils/biz/getBizSplitProportion";

export default function IncomeExplanation() {
    const [incomeTypesOn, setIncomeTypesOn] = useState(false);
    const [agentPerc, setAgentPerc] = useState("...");
    const [primaryAgent, agentJob] = useData(["primaryAgent", "agentJob"]);

    useEffect(() => {
        if (primaryAgent === "...") return;
        const splitData = getBizSplitProportion(primaryAgent);
        setAgentPerc(splitData.perc[agentJob]);
    }, [primaryAgent, agentJob]);

    const isRep = agentJob === "rep-comercial";

    const showDialog = () => (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: 10000 }}
            open={incomeTypesOn}
            aria-labelledby="form-dialog-title"
            className="animated slideInLeft faster"
        >
            <section
                style={{
                    padding: "0 20px",
                }}
            >
                <h2 className="my-3 text-subtitle font-weight-bold text-center text-purple">
                    Tipos de Rendas
                </h2>
                <div>
                    <p
                        className="text-normal text-nowrap text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--incomeGreen)" }}
                    >
                        Renda Ativa
                    </p>
                    <p className="text-normal font-weight-bold text-purple">
                        É o primeiro investimento feito pelo seu cliente. Aquele
                        que ativou seus ganhos.
                    </p>
                </div>
                <div>
                    <p
                        className="text-normal text-nowrap text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--themeP)" }}
                    >
                        Renda Passiva
                    </p>
                    <p className="text-normal font-weight-bold text-purple">
                        Todo investimento após a primeiro investimento do seu
                        cliente é sua renda passiva. Você continua ganhando a
                        cada nova transação do cliente.
                    </p>
                </div>
                <section className="container-center my-3">
                    <ButtonFab
                        title="fechar"
                        onClick={() => setIncomeTypesOn(false)}
                        position="relative"
                        size="medium"
                        variant="extended"
                        backgroundColor="var(--themeSDark)"
                    />
                </section>
            </section>
        </Dialog>
    );

    const showDialogBtn = () => (
        <section className="mt-3 container-center">
            <ButtonFab
                title="Ver tipos de rendas"
                backgroundColor="var(--themeSDark--default)"
                onClick={() => setIncomeTypesOn(true)}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );

    return (
        <Fragment>
            <section className="my-3 text-grey">
                <h2 className="text-small">
                    Você ganha toda vez que seu cliente faz um investimento de
                    serviços da Fiddelize de qualquer valor.
                </h2>
                <p className="text-small">
                    Sua <strong>margem de ganhos</strong> como{" "}
                    <strong>
                        {isRep ? "representante comercial" : agentJob}
                    </strong>{" "}
                    é de{" "}
                    <span
                        className="text-pill text-shadow"
                        style={{ backgroundColor: "grey" }}
                    >
                        {agentPerc}%
                    </span>{" "}
                    para cada transação dos seus clientes.
                </p>
            </section>
            {incomeTypesOn ? showDialog() : showDialogBtn()}
        </Fragment>
    );
}
