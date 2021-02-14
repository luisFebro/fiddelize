import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Img from "../../../../../../../../components/Img";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import isThisApp from "../../../../../../../../utils/window/isThisApp";
import { useClientAdmin } from "../../../../../../../../hooks/useRoleData";
import useScrollUp from "../../../../../../../../hooks/scroll/useScrollUp";

const isApp = isThisApp();

export default withRouter(SuccessFulCcPay);

function SuccessFulCcPay({ history, setMainData }) {
    useScrollUp();

    useEffect(() => {
        setMainData((prev) => ({
            ...prev,
            hideCard: true,
        }));
    }, []);

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
                src="/img/icons/credit-card/processing-transaction.svg"
                offline
                height="auto"
                width="200px"
                alt="cartão em analise"
            />
            <p className="text-subtitle text-p mx-3 font-weight-bold">
                Analisando cartão...
                <br />
                Os serviços investidos ficam disponíveis em instantes.
            </p>
            <p className="text-small text-p my-3 font-weight-bold">
                - Você recebe uma notificação da Fiddelize logo que análise é
                aprovada. Os serviços investidos são liberados automaticamente.
            </p>
            <p className="text-small text-p my-3 font-weight-bold">
                - Caso seu cartão não seja aprovado, o valor é estornado
                imediatamente. Acompanhe com seu banco o motivo da falha.
            </p>
            <p className="text-small text-p font-weight-bold">
                - Caso os serviços não fiquem disponíveis em até 15 minutos,
                saia da sua conta e entre novamente.
            </p>
            <div
                className="container-center"
                style={{
                    marginBottom: "150px",
                }}
            >
                <ButtonFab
                    title="Finalizar"
                    size="large"
                    position="relative"
                    variant="extended"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={handleFinish}
                />
            </div>
        </section>
    );
}
