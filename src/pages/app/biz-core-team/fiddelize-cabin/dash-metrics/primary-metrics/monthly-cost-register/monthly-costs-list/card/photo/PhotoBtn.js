import { useState, Fragment } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncContent = Load({
    loader: () =>
        import(
            "./PhotoContent" /* webpackChunkName: "target-prize-send-photo-full-page-lazy" */
        ),
});

export default function PhotoBtn({ modalData = {} }) {
    const [fullOpen, setFullOpen] = useState(false);
    const { savedImg } = modalData;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Icon = <AddAPhotoIcon style={{ fontSize: 30 }} />;
    return (
        <Fragment>
            {savedImg ? (
                <section className="container-center-col">
                    <img
                        className="shadow-babadoo"
                        src={savedImg}
                        height="auto"
                        width={50}
                        alt=""
                    />
                    <div>
                        <ButtonFab
                            title="Editar"
                            position="relative"
                            onClick={handleFullOpen}
                            variant="extended"
                            size="small"
                            backgroundColor="var(--themeSDark)"
                        />
                    </div>
                </section>
            ) : (
                <ButtonFab
                    iconFontAwesome={Icon}
                    position="relative"
                    onClick={handleFullOpen}
                    size="large"
                    backgroundColor="var(--themeSDark)"
                />
            )}
            <ModalFullContent
                contentComp={
                    <AsyncContent
                        modalData={modalData}
                        handleCloseModal={handleFullClose}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
