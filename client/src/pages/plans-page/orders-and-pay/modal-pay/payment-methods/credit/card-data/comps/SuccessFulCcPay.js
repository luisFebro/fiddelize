import React, { useEffect } from "react";
import Img from "../../../../../../../../components/Img";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import isThisApp from "../../../../../../../../utils/window/isThisApp";
import { withRouter } from "react-router-dom";
import { useClientAdmin } from "../../../../../../../../hooks/useRoleData";
import useScrollUp from "../../../../../../../../hooks/scroll/useScrollUp";
const isApp = isThisApp();

export default withRouter(SuccessFulCcPay);

function SuccessFulCcPay({ history, setMainData }) {
    useEffect(() => {
        setMainData((prev) => ({
            ...prev,
            hideCard: true,
        }));
    }, []);

    useScrollUp();
    const { bizCodeName } = useClientAdmin();

    const handleFinish = () => {
        const path = isApp
            ? "/mobile-app"
            : `/${bizCodeName}/cliente-admin/painel-de-controle`;
        history.push(path);
    };

    return (
        <section className="my-5">
            <Img
                className="img-fluid"
                src="/img/icons/credit-card/approved-transaction.svg"
                offline={true}
                height="auto"
                width="200px"
                alt="cartão aprovado"
            />
            <p className="text-subtitle text-p mx-3 my-3 font-weight-bold">
                Cartão aprovado!
                <br />
                Os serviços investidos já estão disponíveis.
            </p>
            <div className="container-center">
                <ButtonFab
                    title="Finalizar"
                    size="large"
                    position="relative"
                    variant="extended"
                    backgroundColor={`var(--themeSDark--default)`}
                    onClick={handleFinish}
                />
            </div>
        </section>
    );
}
