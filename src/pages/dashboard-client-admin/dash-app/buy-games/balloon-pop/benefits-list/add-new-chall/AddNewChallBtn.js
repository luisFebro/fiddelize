import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";
import showToast from "components/toasts";

const AsyncNewChallContent = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./AddNewChallContent" /* webpackChunkName: "add-new-chall-content-lazy" */
        ),
});

export default function AddNewChallBtn(props) {
    const { itemsCount } = props;
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        const MAX_LIMIT = 9;
        if (itemsCount >= MAX_LIMIT)
            return showToast(
                `O número máximo de ${MAX_LIMIT} benefícios diferentes já foram adicionados`,
                { type: "error" }
            );
        return setFullOpen(true);
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
                contentComp={
                    <AsyncNewChallContent
                        {...props}
                        closeModal={handleFullClose}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
