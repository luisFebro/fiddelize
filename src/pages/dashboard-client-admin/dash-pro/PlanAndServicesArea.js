import { Fragment } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import RedirectLink from "../../../components/RedirectLink";
import AdminFidelidometro from "./admin-fidelidometro/AdminFidelidometro";
import usePro from "../../../hooks/pro/usePro";

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

    let { loading, plan: currPlan, totalScore } = usePro();
    currPlan = !loading && currPlan && currPlan.cap();

    const isFree = currPlan === "Gratis";

    const showClubCTA = () => {
        const getCTABtn = (to, title, noIcon = false) => (
            <RedirectLink to={to}>
                <ButtonFab
                    size="large"
                    title={title}
                    onClick={null}
                    backgroundColor="var(--themeSDark--default)"
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
                            Comece a investir em serviços da Fiddelize e entre
                            para o clube
                        </div>
                        <div className="container-center my-5">
                            {getCTABtn(
                                "/planos?cliente-admin=1",
                                "Adicionar serviço",
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

    const handleVersion = () => {
        if (loading) return "...";
        return isFree ? "Atual" : "Pro";
    };

    return (
        <section className="my-5">
            <div className="text-subtitle font-weight-bold text-purple">
                Versão {handleVersion()}:
                <span className="d-block text-em-1-7">
                    {isFree ? "" : "Plano"} {currPlan || "..."}
                </span>
            </div>
            {showClubCTA()}
            <AdminFidelidometro loading={loading} totalScore={totalScore} />
        </section>
    );
}
