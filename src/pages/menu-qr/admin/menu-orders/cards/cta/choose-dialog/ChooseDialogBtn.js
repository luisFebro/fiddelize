import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";

const AsyncChooseDialog = Load({
    loading: true,
    loader: () =>
        import(
            "./ChooseDialog" /* webpackChunkName: "choose-dialog-page-lazy" */
        ),
});

export default function ChooseDialogBtn(props) {
    const [fullOpen, setFullOpen] = useState(false);
    const { themeSColor } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                title="escolher"
                size="medium"
                right={15}
                bottom={15}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                variant="extended"
                needBtnShadow
                shadowColor="white"
                onClick={handleFullOpen}
            />
            <ModalFullContent
                contentComp={
                    <AsyncChooseDialog
                        closeModal={handleFullClose}
                        {...props}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor="var(--mainWhite)"
            />
        </section>
    );
}
