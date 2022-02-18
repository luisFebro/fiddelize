import { useEffect, useState } from "react";
import { updateUser } from "api/frequent";
import { useBizData } from "init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

export default function ActivateContent() {
    const [isActivated, setIsActivated] = useState(false);
    const { bizId } = useBizData();

    useEffect(() => {
        setIsActivated(false);
        const dataToSend = {
            "clientAdminData.digitalMenu.interface": true,
        };

        updateUser(bizId, "cliente-admin", dataToSend)
            .then(() => {
                setIsActivated(true);
            })
            .catch(() => {
                showToast(
                    "Ocorreu um erro de conexão ao ativar, tente novamente.",
                    { type: "error" }
                );
                setIsActivated(false);
            });
    }, [bizId]);

    const showTitle = () => (
        <h2
            style={{ top: 40 }}
            className="m-0 position-relative mb-3 container-center"
        >
            <span className="position-relative text-center font-weight-bold text-purple text-subtitle">
                Ativação Menu Digital
                <span
                    className="position-absolute text-normal text-purple font-weight-bold"
                    style={{
                        bottom: -24,
                        right: 0,
                    }}
                >
                    beta
                </span>
            </span>
        </h2>
    );

    return (
        <div>
            {showTitle()}
            {isActivated ? (
                <section
                    className="mx-3 text-center text-normal text-purple container-center-col"
                    style={{ marginTop: 150 }}
                >
                    <FontAwesomeIcon
                        icon="check-circle"
                        style={{
                            fontSize: 100,
                            color: "var(--themeP)",
                        }}
                        className="d-block animated rubberBand delay-1s"
                    />
                    <div className="font-weight-bold text-subtitle text-purple">
                        Serviço Ativo!
                    </div>
                    <p>Já está disponível na tela inicial do seu app admin.</p>
                    <div className="container-center">
                        <ButtonFab
                            title="Acessar"
                            backgroundColor="var(--themeSDark)"
                            onClick={() => {
                                showToast("Iniciando...", { dur: 30000 });
                                window.location.href = "/app";
                            }}
                            position="relative"
                            variant="extended"
                            size="large"
                        />
                    </div>
                </section>
            ) : (
                <div
                    style={{ marginTop: 150 }}
                    className="font-weight-bold text-center text-subtitle text-purple"
                >
                    Ativando...
                </div>
            )}
        </div>
    );
}
