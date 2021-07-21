import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncNewPrizeContent = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./AddNewPrizeContent" /* webpackChunkName: "add-new-prize-content-lazy" */
        ),
});

export default function AddNewPrizeBtn(props) {
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
                title="adicionar"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color="white"
                backgroundColor="var(--themeSDark--default)"
                needBtnShadow={false}
            />
            <ModalFullContent
                contentComp={<AsyncNewPrizeContent {...props} />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
