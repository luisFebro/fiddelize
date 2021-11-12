import { Fragment } from "react";
import useData from "init";
import Img from "components/Img";
import ProRenewalBtn from "components/pro/ProRenewalBtn";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

export default function FuncExpModalContent({
    // app,
    handleClose,
}) {
    const { role } = useData();
    const isAdmin = role === "cliente-admin";

    return (
        <section style={{ marginTop: isAdmin ? 150 : 50 }}>
            <Img
                src="img/illustrations/pro/func-exp.svg"
                alt="funcionalidade expirada"
                height="auto"
                className="mx-3"
                width={350}
                title="Funcionalidade<br />desativada"
            />
            <div className={`${isAdmin ? "my-5" : "my-3"} mx-5`}>
                {isAdmin ? (
                    <ProRenewalBtn title="Renovar plano" width="100%" />
                ) : (
                    <Fragment>
                        <p className="text-normal text-purple">
                            Contate o admin do clube de compras para ativação.
                        </p>
                        <div
                            className={`${
                                isAdmin ? "my-5" : "my-3"
                            } container-center`}
                        >
                            <ButtonFab
                                title="Voltar"
                                backgroundColor="var(--themeSDark)"
                                onClick={handleClose}
                                position="relative"
                                variant="extended"
                                size="large"
                                width="100%"
                            />
                        </div>
                    </Fragment>
                )}
            </div>
        </section>
    );
}
