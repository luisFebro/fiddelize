import React from "react";
import "./_CtaSection.scss";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";

export default function CtaSection() {
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
                            onClick={null}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
