import { useState, Fragment } from "react";
import PhotoSizeSelectActualIcon from "@material-ui/icons/PhotoSizeSelectActual";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncContent = Load({
    loader: () =>
        import(
            "./ShowPhotoContent" /* webpackChunkName: "target-prize-show-photo-full-page-lazy" */
        ),
});

export default function ShowPhotoBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <Fragment>
            <section className="container-center-col">
                <PhotoSizeSelectActualIcon
                    style={{ fontSize: 40, color: "var(--mainWhite)" }}
                />
                <div className="mt-3">
                    <ButtonFab
                        title="Ver"
                        position="relative"
                        onClick={handleFullOpen}
                        variant="extended"
                        size="small"
                        backgroundColor="var(--themeSDark)"
                    />
                </div>
            </section>
            <ModalFullContent
                contentComp={<AsyncContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
