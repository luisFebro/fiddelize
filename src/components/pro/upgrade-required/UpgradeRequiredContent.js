import { Fragment } from "react";
import Img from "components/Img";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Link } from "react-router-dom";

export default function UpgradeRequiredContent({
    msg = "Assine um plano pro da Fiddelize e continue adicionando mais fotos.",
    handleClose,
}) {
    return (
        <section style={{ marginTop: 20 }}>
            <Img
                src="/img/illustrations/pro/pro-upgrade-required.svg"
                alt="funcionalidade expirada"
                height="auto"
                className="mx-3"
                width={300}
                title="Atualize para<br />um plano pro"
            />
            <div className="my-3 mx-5">
                <Fragment>
                    <p className="text-normal text-purple">{msg}</p>
                    <div className="my-3 container-center-col">
                        <Link
                            to="/planos?cliente-admin=1"
                            className="no-text-decoration"
                        >
                            <ButtonFab
                                title="Ver planos"
                                position="relative"
                                variant="extended"
                                onClick={null}
                                size="large"
                                color="white"
                                backgroundColor="var(--niceUiYellow)"
                            />
                        </Link>
                        <div className="mt-4">
                            <ButtonFab
                                title="Voltar"
                                backgroundColor="var(--themeSDark)"
                                onClick={handleClose}
                                position="relative"
                                variant="extended"
                                size="small"
                            />
                        </div>
                    </div>
                </Fragment>
            </div>
        </section>
    );
}
