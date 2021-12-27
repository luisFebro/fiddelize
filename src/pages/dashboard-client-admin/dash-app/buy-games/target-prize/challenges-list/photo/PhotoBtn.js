import { useState, useEffect, Fragment } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import UpgradeRequiredModal from "components/pro/upgrade-required/UpgradeRequiredModal.js";
import usePro from "init/pro";

const AsyncPhotoContent = Load({
    loader: () =>
        import(
            "./PhotoContent" /* webpackChunkName: "target-prize-send-photo-full-page-lazy" */
        ),
});

export default function PhotoBtn({ modalData = {} }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [proModal, setProModal] = useState(false);
    const [newImg, setNewImg] = useState(false);
    const { savedPrizeImg, gotSomePic } = modalData;

    const { plan } = usePro();

    useEffect(() => {
        if (savedPrizeImg) setNewImg(savedPrizeImg);
    }, [savedPrizeImg]);

    const handleFullOpen = () => {
        const isFreeUserWithOnePic = gotSomePic && plan === "gratis";
        if (isFreeUserWithOnePic) return setProModal(true);
        return setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Icon = <AddAPhotoIcon style={{ fontSize: 30 }} />;
    return (
        <Fragment>
            {newImg ? (
                <section className="container-center-col">
                    <img
                        className="shadow-babadoo"
                        src={newImg}
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
                    <AsyncPhotoContent
                        modalData={modalData}
                        newImg={newImg}
                        setNewImg={setNewImg}
                        handleCloseModal={handleFullClose}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
            {proModal && (
                <UpgradeRequiredModal
                    proModal={proModal}
                    setProModal={setProModal}
                />
            )}
        </Fragment>
    );
}
