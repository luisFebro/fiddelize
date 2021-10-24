import { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Img from "components/Img";
import setProRenewal from "utils/biz/setProRenewal";
import NotesSwitcher from "components/buttons/NotesSwitcher";
import { PeriodSelection } from "../../../comps/MainComps";
import Simulator from "./Simulator";

export default withRouter(AsyncAddCustomersContent);

function AsyncAddCustomersContent({ history, modalData, handleFullClose }) {
    let {
        handleItem,
        period,
        // creditsBadge
        isCreditsBadge,
        currPlan,
        expiryDate,
        // end creditsBadge
    } = modalData;

    const [data, setData] = useState({
        totalPackage: 0,
        totalCustomers: 0,
        inv: 0,
        innerPeriod: "monthly",
        // SKU: "",
    });
    const { inv, totalPackage, totalCustomers, innerPeriod } = data;

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
        if (isCreditsBadge) return "";
        return period === "yearly" ? "Anual" : "Mensal";
    };

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Novvos Clientes
                <br />
                {handlePeriodName()}
            </p>
        </div>
    );

    const handleCTA = () => {
        const isFunc = typeof handleItem === "function";

        const item = {
            name: "Novvos Clientes",
            count: totalCustomers,
            amount: inv,
        };

        if (isFunc) {
            handleItem("update", { item });
            handleFullClose();
        }

        if (isCreditsBadge) {
            setProRenewal({
                expiryDate,
                orderList: [{ "Novvos Clientes": item }],
                period: innerPeriod,
                planBr: currPlan,
                ref: undefined,
                investAmount: inv,
                isSingleRenewal: true,
            }).then(() => {
                history.push("/pedidos/admin");
            });
        }
    };

    const showCTA = () => (
        <section className="mx-3 my-5 container-center">
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
                src="/img/illustrations/empty-recorded-customers.svg"
                className=""
                alt="ilustração principal"
                width={200}
                height="auto"
            />
            <p className="mx-3 text-normal text-purple">
                Seus clientes no próximo nível do marketing de relacionamento
                com destaques como <strong>moeda digital</strong> para troca de
                benecífios, <strong>cartão digital e jogos de compra</strong>.
                Vão ter mais motivos para voltar a comprar do seu negócio.
                Invista em seus clientes!
            </p>
        </Fragment>
    );

    const showPeriodSelection = () => (
        <PeriodSelection containerCenter handlePeriod={handleInnerPeriod} />
    );

    return (
        <section>
            {showTitle()}
            {showIllustrationAndAbout()}
            {isCreditsBadge && showPeriodSelection()}
            <Simulator
                handleData={handleData}
                period={period}
                currPlan={currPlan}
                animaDisabled
            />
            {showNotes()}
            {showCTA()}
        </section>
    );
}

/* ARCHIVED
const notes = (
    <section className="text-purple font-site text-em-1-2 my-3 text-left mx-3">
        <p className="text-left text-purple mt-3">
            - Uma vez cadastrado, seus clientes usam o{" "}
            <strong>app sem restrições ou anúncios</strong> com app
            personalizado com sua marca, mesmo quando seu plano expirar.
        </p>
        <p className="text-left mt-3">
            - Note, porém, que após o <strong>término do seu plano</strong>,
            o mês de manutenção é iniciado e o prazo de expiração das moedas
            de seus clientes é ativada automaticamente. Todos
            seus clientes são notificados que precisam usar as moedas em até
            30 dias antes de expirá-las 100%. Renovando seu plano, o mês de manutenção é desativado.
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

{period === "yearly" && (
    <p className="text-left mt-3">
        No plano anual, os créditos do serviço Novvos clientes são creditados mensalmente na mesma quantia contratada e no mesmo dia da renovação/ativação do plano.
    </p>
)}

<p className="text-small text-left text-purple mt-3">
    - Caso ainda possua créditos válidos anteriores, o sistema da
    Fiddelize <strong>acumula esses créditos com os atuais</strong>.
    O <strong>tempo de validade</strong> é acumulado da mesma forma
    também.
</p>
<p className="text-small text-left text-purple mt-3">
    - Quando expira seu tempo de uso, os seus{" "}
    <strong>créditos restantes são zerados</strong>. Você é
    notificado <strong>5 dias</strong> antes do prazo expirar.
    Renovando o serviço, você extende o tempo de uso dos créditos.
</p>


<p className="text-small text-left text-purple mt-3">
    - se um cliente ficar{" "}
    <strong>
        inativo por 3 meses e sem saldo em moeda PTS em conta
    </strong>
    , contando a partir da última data da compra; neste caso, a
    conta do cliente é <strong>removida automaticamente</strong>.
</p>

*/
