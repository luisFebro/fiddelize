import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import Simulator from "./Simulator";
import { useProfile } from "init";
import getFirstName from "../../../../../utils/string/getFirstName";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import Img from "../../../../../components/Img";
import setProRenewal from "../../../../../utils/biz/setProRenewal";

export default withRouter(AsyncAddSMSContent);

function AsyncAddSMSContent({
    history,
    handleNewOrder,
    handleFullClose,
    needRemoveCurrValue,
    currValues,
    modalData,
}) {
    // end fromSession
    const isFromSession = modalData && modalData.isFromSession;
    const currPlan = modalData ? modalData.currPlan : "bronze";
    // end fromSession

    const [data, setData] = useState({
        totalPackage: 0,
        totalSMS: 0,
        inv: 0,
    });
    const { inv, totalSMS, totalPackage, SKU } = data;

    const handleData = (newData) => {
        setData({
            ...data,
            ...newData,
        });
    };

    let { name: userName } = useProfile();
    userName = getFirstName(userName);

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Créditos SMS
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
        </section>
    );

    const handleCTA = () => {
        const needCurrRemoval = needRemoveCurrValue; // && currValues.amount !== totalSMS;
        const isFunc = typeof handleNewOrder === "function";

        const orderObj = {
            totalPackage,
            amount: totalSMS,
            price: inv,
            removeCurr: !!needCurrRemoval,
        };
        isFunc && handleNewOrder("sms", { order: orderObj });
        isFunc && handleFullClose();

        if (isFromSession) {
            setProRenewal({
                expiryDate: "2050-11-26T16:51:32.848Z", // a very late hard-coded date cuz it does not expires.
                orders: { sms: orderObj },
                period: "yearly",
                planBr: currPlan,
                ref: undefined,
                investAmount: inv,
            }).then((res) => {
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
            src="/img/illustrations/sms-message.svg"
            className=""
            alt="ilustração principal"
            width={150}
            height="auto"
        />
    );

    return (
        <section>
            {showTitle()}
            {showIllustration()}
            <p className="my-3 text-purple text-center text-subtitle">
                Deslize para mudar a quantidade de pacotes.
            </p>
            <Simulator handleData={handleData} />
            {showNotes()}
            {showCTA()}
        </section>
    );
}
