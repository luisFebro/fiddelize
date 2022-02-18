import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncContent = Load({
    loader: () =>
        import(
            "./ActivateContent" /* webpackChunkName: "activate-content-lazy" */
        ),
});

export default function ActivateBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                title="ativar"
                position="relative"
                variant="extended"
                onClick={handleFullOpen}
                size="medium"
                color="white"
                backgroundColor="var(--themeSDark)"
            />
            <ModalFullContent
                contentComp={<AsyncContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
