import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncActiveItemsContent = Load({
    loader: () =>
        import(
            "./ActiveItemsContent" /* webpackChunkName: "active-pro-items-full-page-lazy" */
        ),
});

export default function ActiveItemsBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncContent = <AsyncActiveItemsContent />;

    return (
        <Fragment>
            <ButtonFab
                title="Ver serviços ativos"
                backgroundColor="var(--themeSDark)"
                onClick={() => handleFullOpen()}
                position="relative"
                variant="extended"
                size="large"
            />
            <ModalFullContent
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                contentComp={AsyncContent}
                needIndex={false}
            />
        </Fragment>
    );
}
