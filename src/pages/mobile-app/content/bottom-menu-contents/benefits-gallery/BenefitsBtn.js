import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RadiusBtn from "components/buttons/RadiusBtn";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncBenefitsGalleryList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./BenefitsGalleryList.js" /* webpackChunkName: "benefits-gallery-content-lazy" */
        ),
});

export default function BenefitsBtn({
    colorS,
    title = "",
    position = "relative",
    top = -10,
    shadowColor = null,
    size,
    backgroundColor,
    targetId,
    radiusBtn = false,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Gallery = <AsyncBenefitsGalleryList targetId={targetId} />;

    const showBtn = () => (
        <Fragment>
            {radiusBtn ? (
                <RadiusBtn
                    size={size}
                    title={title}
                    onClick={handleFullOpen}
                    position="relative"
                    backgroundColor={
                        backgroundColor || `var(--themeSDark--${colorS})`
                    }
                />
            ) : (
                <ButtonFab
                    position={position}
                    top={top}
                    size={size}
                    onClick={handleFullOpen}
                    title={title}
                    shadowColor={shadowColor}
                    needBtnShadow={!!shadowColor}
                    needTxtNoWrap
                    variant="extended"
                    color="white"
                    backgroundColor={
                        backgroundColor || `var(--themeSDark--${colorS})`
                    }
                />
            )}
        </Fragment>
    );

    return (
        <section>
            {showBtn()}
            <ModalFullContent
                contentComp={Gallery}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
