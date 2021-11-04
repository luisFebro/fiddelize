import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncRateFiddelize = Load({
    loader: () =>
        import(
            "./RateFiddelize" /* webpackChunkName: "rate-fiddelize-full-page-lazy" */
        ),
});

export default function RateFiddelizeBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncContent = <AsyncRateFiddelize />;

    return (
        <Fragment>
            <ButtonFab
                title="Avalie"
                backgroundColor="var(--themeSDark)"
                onClick={() => handleFullOpen()}
                position="relative"
                variant="extended"
                size="medium"
            />
            <ModalFullContent
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                contentComp={AsyncContent}
            />
        </Fragment>
    );
}
