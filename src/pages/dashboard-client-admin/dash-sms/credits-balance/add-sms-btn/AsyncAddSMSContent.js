import { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Img from "components/Img";
import setProRenewal from "utils/biz/setProRenewal";
import Simulator from "./Simulator";

export default withRouter(AsyncAddSMSContent);

function AsyncAddSMSContent({
    history,
    handleItem,
    handleFullClose,
    modalData,
}) {
    // end fromSession
    const isFromSession = modalData && modalData.isFromSession;
    const currPlan = modalData ? modalData.currPlan : "bronze";
    // end fromSession

    const [data, setData] = useState({
        totalSMS: 0,
        inv: 0,
    });
    const { inv, totalSMS } = data;

    const handleData = (newData) => {
        setData({
            ...data,
            ...newData,
        });
    };

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Créditos SMS
            </p>
        </div>
    );

    const handleCTA = () => {
        const isFunc = typeof handleItem === "function";

        const item = {
            range: "selected",
            expirable: false,
            name: "sms",
            count: totalSMS,
            amount: inv,
        };

        if (isFunc) {
            handleItem("update", { item });
            handleFullClose();
        }

        if (isFromSession) {
            setProRenewal({
                itemList: [item],
                period: "infinite",
                planBr: currPlan,
                investAmount: inv,
            }).then(() => {
                history.push("/pedidos/admin");
            });
        }
    };

    const showCTA = () => (
        <section className="mx-3 my-5 container-center">
            <ButtonFab
                size="large"
                title="Adicionar"
                width="100%"
                onClick={handleCTA}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showIllustration = () => (
        <Fragment>
            <Img
                src="/img/illustrations/sms-message.svg"
                className=""
                alt="ilustração principal"
                width={150}
                height="auto"
            />
            <p className="mx-3 text-normal text-purple">
                Tenha SMS como mais um meio eficiente de se comunicar e fisgar a
                atenção dos clientes com suas campanhas, anúncios e eventos do
                seu negócio. Pode também ser usado para comunicação entre a
                equipe ou pessoal em geral com recursos exclusivos como
                agendamento de envios.
            </p>
        </Fragment>
    );

    return (
        <section>
            {showTitle()}
            {showIllustration()}
            <Simulator handleData={handleData} />
            {showCTA()}
        </section>
    );
}

/*

const showNotes = () => (
    <section className="my-3 text-left mx-3">
        <p className="text-purple text-left text-subtitle font-weight-bold m-0">
            Notas <FontAwesomeIcon icon="info-circle" />
        </p>
        <p className="text-small text-left text-purple mt-3">
            - Os créditos são <strong>liberados automaticamente</strong>{" "}
            após a aprovação do pagamento.
        </p>
    </section>
);

 */
