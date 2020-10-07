import React, { Fragment } from "react";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RedirectLink from "../../../components/RedirectLink";

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function PlanAndServicesArea() {
    const styles = getStyles();

    const PlusIcon = <AddCircleOutlineIcon style={styles.muStyle} />;

    let loading = false;
    let currPlan = "ouro";
    let period = "anual";
    currPlan = !loading && currPlan.cap();
    period = !loading && period.cap();

    const isFree = currPlan === "gratis";
    const adminName = "Febro";

    const showClubCTA = () => {
        const getCTABtn = (to, title, noIcon = false) => (
            <RedirectLink to={to}>
                <ButtonFab
                    size="large"
                    title={title}
                    onClick={null}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant="extended"
                    position="relative"
                    iconMu={noIcon ? undefined : PlusIcon}
                />
            </RedirectLink>
        );

        return (
            <section>
                {isFree ? (
                    <Fragment>
                        <div className="my-5 text-purple text-subtitle font-weight-bold text-center">
                            {adminName}, vamos entrar para o club pro e começar
                            a conquistar mais clientes?
                        </div>
                        <div className="container-center my-5">
                            {getCTABtn(
                                "/planos?cliente-admin=1",
                                "Quero entrar",
                                true
                            )}
                        </div>
                    </Fragment>
                ) : (
                    <div
                        className={`container-center ${isFree && "my-5"}`}
                        style={{ margin: !isFree ? "100px 0" : undefined }}
                    >
                        {getCTABtn(
                            "/planos?cliente-admin=1",
                            "Adicionar serviços"
                        )}
                    </div>
                )}
            </section>
        );
    };

    return (
        <section className="my-5">
            <div className="text-subtitle font-weight-bold text-purple">
                Versão {isFree ? "Atual" : "Pro"}:
                <span className="d-block text-em-1-7">
                    {isFree ? "" : "Plano"} {currPlan}
                </span>
                <span className="d-block text-em-1-4">{!isFree && period}</span>
            </div>
            {showClubCTA()}
        </section>
    );
}
