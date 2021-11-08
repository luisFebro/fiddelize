import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

export const AsyncPricingTable = LoadableVisible({
    loader: () =>
        import(
            "../PricingTable" /* webpackChunkName: "pricing-table-comp-lazy" */
        ),
});

export default function PricingTableBtn({ setCurrPlan }) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    // Lesson: there is no fidd if declare Comp or set this comp directly.
    const Comp = (
        <Fragment>
            <AsyncPricingTable marginTop={100} setCurrPlan={setCurrPlan} />
            <div className="my-5 container-center">
                <ButtonFab
                    title="Voltar"
                    position="relative"
                    onClick={handleFullClose}
                    variant="extended"
                    size="large"
                    backgroundColor="var(--themeSDark)"
                />
            </div>
        </Fragment>
    );

    return (
        <section className="container-center">
            <ButtonFab
                title="Compare planos"
                position="relative"
                onClick={handleFullOpen}
                variant="extended"
                size="large"
                backgroundColor="var(--themeSDark)"
            />
            <ModalFullContent
                contentComp={Comp}
                fullOpen={fullOpen}
                backgroundColor="var(--themeP)"
                needIndex={101}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
