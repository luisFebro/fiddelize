import { Fragment, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import useData from "init";
import getBizSplitProportion from "utils/biz/getBizSplitProportion";

export default function IncomeExplanation() {
    const [incomeTypesOn, setIncomeTypesOn] = useState(false);
    const [agentPerc, setAgentPerc] = useState("...");
    const [primaryAgent, agentJob] = useData(["primaryAgent", "agentJob"]);

    useEffect(() => {
        if (primaryAgent === "...") return;
        const splitData = getBizSplitProportion(primaryAgent);
        setAgentPerc(splitData && splitData.perc && splitData.perc[agentJob]);
    }, [primaryAgent, agentJob]);

    const isRep = agentJob === "rep-comercial";

    const showDialog = () => (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: 10000 }}
            open={incomeTypesOn}
            aria-labelledby="form-dialog-title"
            className="animated fadeInUp"
        >
            <section
                className="text-purple text-normal"
                style={{
                    padding: "0 20px",
                }}
            >
                <h2 className="my-3 text-subtitle font-weight-bold text-center">
                    Seus ganhos
                </h2>
                <p>
                    Você ganha toda vez que seu cliente faz um investimento de
                    serviços da Fiddelize de qualquer valor.
                </p>
                <p>
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
                <h2 className="my-3 text-subtitle font-weight-bold text-center">
                    Tipos de Rendas
                </h2>
                <div>
                    <p
                        className="text-nowrap text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--incomeGreen)" }}
                    >
                        Renda Ativa
                    </p>
                    <p>
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
                    <p>
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
        <section className="mt-5 container-center">
            <ButtonFab
                title="ganhos e rendas"
                backgroundColor="var(--themeSDark--default)"
                onClick={() => setIncomeTypesOn(true)}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );

    return (
        <Fragment>{incomeTypesOn ? showDialog() : showDialogBtn()}</Fragment>
    );
}
