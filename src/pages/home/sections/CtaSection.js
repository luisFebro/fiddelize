import "./_CtaSection.scss";
import { withRouter } from "react-router-dom";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import gaEvent from "../../../utils/analytics/gaEvent";

export default withRouter(CtaSection);
function CtaSection({ history }) {
    return (
        <section className="cta-section--root">
            <div className="container">
                <div className="cta-inner section-inner">
                    <h3 className="section-title mt-0">Comece agora mesmo</h3>
                    <div className="container-center mt-5 mb-3 mx-5">
                        <ButtonFab
                            position="relative"
                            variant="extended"
                            title="Fazer primeiro app"
                            size="large"
                            backgroundColor="var(--themeSDark)"
                            onClick={() => {
                                history.push("/novo-app/info-negocio");
                                gaEvent({
                                    label: "CtaSection",
                                    category: "CTA",
                                    action:
                                        "create cli-admin app (bottom page)",
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
