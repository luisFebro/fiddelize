import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Img from "components/Img";
import setProRenewal from "utils/biz/setProRenewal";
import { PeriodSelection } from "../../../comps/MainComps";
import Simulator from "./Simulator";

export default withRouter(AsyncAddMembersContent);

function AsyncAddMembersContent({ history, modalData, handleFullClose }) {
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
        inv: 0,
        innerPeriod: "monthly",
        // totalMembers: 0,
        // SKU: "",
    });
    const { inv, totalPackage, innerPeriod } = data;

    period = period || innerPeriod;

    // useEffect(() => {
    //     isCreditsBadge && setProRef({ setData, period, planBr: currPlan });
    // }, [period, currPlan]);

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
                &#187; Novvos Membros
                <br />
                {handlePeriodName()}
            </p>
        </div>
    );

    const showNotes = () => (
        <section className="my-3 text-left mx-3">
            <p className="text-purple text-left text-subtitle font-weight-bold m-0">
                Notas <FontAwesomeIcon icon="info-circle" />
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Os créditos são <strong>liberados automaticamente</strong>{" "}
                após a aprovação do pagamento.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Os apps dos membros são
                <strong> temporariamente desativados</strong> após a expiração
                do plano.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Com a exceção do seu <strong>primeiro app de membro</strong>{" "}
                da sua conta, que é grátis e sem tempo de expiração.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Renove o tempo de uso do serviço facilmente indo no seu painel
                na aba PRO.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Você é notificado <strong>5 dias</strong> antes do prazo
                expirar.
            </p>
        </section>
    );

    const handleCTA = () => {
        const isFunc = typeof handleItem === "function";

        // totalPackage is the count since there is no package
        const item = {
            name: "Novvos Membros",
            count: totalPackage,
            amount: inv,
        };

        if (isFunc) {
            handleItem("update", { item });
            handleFullClose();
        }

        if (isCreditsBadge) {
            setProRenewal({
                expiryDate,
                orderList: [{ "Novvos Membros": item }],
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
        <section className="my-5 container-center">
            <ButtonFab
                size="large"
                title="Adicionar"
                onClick={handleCTA}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showIllustration = () => (
        <Img
            src="/img/pro-features/novvos/novvos-membros.svg"
            className=""
            alt="ilustração principal"
            width={200}
            height="auto"
        />
    );

    const showPeriodSelection = () => (
        <PeriodSelection containerCenter handlePeriod={handleInnerPeriod} />
    );

    return (
        <section>
            {showTitle()}
            {showIllustration()}
            {isCreditsBadge && showPeriodSelection()}
            <p className="my-3 text-purple text-center text-subtitle">
                Deslize para mudar a quantidade de membros.
            </p>
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
