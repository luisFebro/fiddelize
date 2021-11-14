import { useState, Fragment } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncContent = Load({
    loader: () =>
        import(
            "./SendPhotoContent" /* webpackChunkName: "target-prize-send-photo-full-page-lazy" */
        ),
});

export default function SendPhotoBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Icon = <AddAPhotoIcon style={{ fontSize: 30 }} />;
    return (
        <Fragment>
            <ButtonFab
                iconFontAwesome={Icon}
                position="relative"
                onClick={handleFullOpen}
                size="large"
                backgroundColor="var(--themeSDark)"
            />
            <ModalFullContent
                contentComp={<AsyncContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
