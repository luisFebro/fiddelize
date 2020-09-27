import React, { useState } from "react";
import Simulator from "./Simulator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProfile } from "../../../../../../hooks/useRoleData";
import getFirstName from "../../../../../../utils/string/getFirstName";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import Img from "../../../../../../components/Img";

export default function AsyncAddCustomersContent({
    modalData,
    handleFullClose,
    needRemoveCurrValue,
}) {
    const { handleNewOrder, period = "yearly" } = modalData;

    const [data, setData] = useState({
        totalPackage: 0,
        totalCustomers: 0,
        inv: 0,
    });
    const { inv, totalCustomers, totalPackage } = data;

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
                &#187; Novvos Clientes
                <br />
                {period === "yearly" ? "Anual" : "Mensal"}
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
        const needCurrRemoval = needRemoveCurrValue; // && currValues.amount !== totalCustomers;
        const isFunc = typeof handleNewOrder === "function";

        const orderObj = {
            totalPackage,
            amount: totalCustomers,
            price: inv,
            removeCurr: needCurrRemoval ? true : false,
        };
        isFunc && handleNewOrder("customers", { order: orderObj });

        handleFullClose();
    };

    const showCTA = () => (
        <section className="my-5 container-center">
            <ButtonFab
                size="large"
                title="Adicionar"
                onClick={handleCTA}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showIllustration = () => (
        <Img
            src="/img/illustrations/empty-recorded-customers.svg"
            className=""
            alt="ilustração principal"
            width={200}
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
            <Simulator handleData={handleData} period={period} />
            {showNotes()}
            {showCTA()}
        </section>
    );
}
