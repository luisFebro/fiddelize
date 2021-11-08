import { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Img from "components/Img";
import Simulator from "./Simulator";
// import NotesSwitcher from "components/buttons/NotesSwitcher";

export default withRouter(AsyncAddMembersContent);

function AsyncAddMembersContent({ history, modalData, handleFullClose }) {
    let { period } = modalData;
    const { handleItem, currPlan } = modalData;

    const [data, setData] = useState({
        totalPackage: 0,
        inv: 0,
        innerPeriod: "monthly",
        // totalMembers: 0,
        // SKU: "",
    });
    const { inv, totalPackage, innerPeriod } = data;

    period = period || innerPeriod;

    const handleInnerPeriod = (newPeriod) => {
        setData({ ...data, innerPeriod: newPeriod });
    };

    const handleData = (newData) => {
        setData({
            ...data,
            ...newData,
        });
    };

    const handlePeriodName = () => {
        return period === "yearly" ? "Anual" : "Mensal";
    };

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Novvos Membros
                <br />
                {handlePeriodName()}
            </p>
        </div>
    );

    const handleCTA = () => {
        const isFunc = typeof handleItem === "function";

        // totalPackage is the count since there is no package
        const item = {
            range: "selected",
            expirable: true,
            name: "Novvos Membros",
            count: Number(totalPackage),
            creditType: "fixed",
            amount: Number(inv),
        };

        if (isFunc) {
            handleItem("update", { item });
            handleFullClose();
        }
    };

    const showCTA = () => (
        <section className="my-5 mx-3 container-center">
            <ButtonFab
                size="large"
                width="100%"
                title="Adicionar"
                onClick={handleCTA}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showIllustrationAndAbout = () => (
        <Fragment>
            <Img
                src="/img/pro-features/novvos/novvos-membros.svg"
                className=""
                alt="ilustração principal"
                width={200}
                height="auto"
            />
            <p className="mx-3 text-normal text-purple">
                Membros da sua equipe te ajudam a cadastrar moedas e clientes,
                ver históricos e avaliações, confirmar benefícios, recebimentos
                e mais.
            </p>
        </Fragment>
    );

    return (
        <section>
            {showTitle()}
            {showIllustrationAndAbout()}
            <Simulator
                handleData={handleData}
                period={period}
                currPlan={currPlan}
                animaDisabled
            />
            {showCTA()}
        </section>
    );
}

/* ARCHIVES
const notes = (
    <section className="font-site text-em-1-2 my-3 text-left mx-3 text-purple">
        {period === "yearly" && (
            <Fragment>
                <p>
                    No plano anual, os créditos do serviço Novvos Membros são fixos e não se renovam como acontece para o serviço de Novvos Clientes. Isso significa que você mantém a mesma quantia de membros conectados ao longo do plano.
                </p>
                <p>
                    Caso precise adicionar mais créditos, basta investir em mais créditos no plano Bronze, mesmo que tenha o plano prata ou ouro. Seu plano atual é atualizado com a nova quantia. Porém, o ciclo do plano permanece o mesmo.
                </p>
            </Fragment>
        )}
        <p className="text-left mt-3">
            - Renove o tempo de uso do serviço facilmente indo no seu painel
            na <strong>aba PRO</strong>.
        </p>
        <p className="text-left mt-3">
            - Você é notificado <strong>5 dias</strong> antes do prazo
            expirar.
        </p>
    </section>
);

const showNotes = () => (
    <NotesSwitcher
        color="text-purple"
        btnStyle={{ top: -35, right: -80 }}
        btnSize="small"
        notes={notes}
        rootClassName="mx-3"
        shadowTitle={undefined}
    />
);

 */
