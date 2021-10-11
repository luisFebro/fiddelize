import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncNewPrizeContent = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./GeneralTweaksContent" /* webpackChunkName: "benefits-general-tweaks-content-lazy" */
        ),
});

export default function GeneralTweaks(props) {
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
                position="relative"
                onClick={() => handleFullOpen(true)}
                title="Ajustes Gerais"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color="white"
                backgroundColor="var(--themeSDark--default)"
                needBtnShadow={false}
            />
            <ModalFullContent
                contentComp={
                    <AsyncNewPrizeContent
                        {...props}
                        closeModal={handleFullClose}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
