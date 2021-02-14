import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

const AsyncModalContent = Load({
    loader: () =>
        import(
            "./AsyncModalContent" /* webpackChunkName: "admin-prizes-full-page-lazy" */
        ),
});

const btnIconStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1px grey)",
    color: "var(--mainWhite)",
};

export default function AdminPrizesBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const ThisContent = <AsyncModalContent />;

    return (
        <section>
            <ButtonFab
                size="large"
                title="Galeria Prêmios"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
                iconFontAwesome={
                    <FontAwesomeIcon icon="trophy" style={btnIconStyle} />
                }
            />
            <ModalFullContent
                contentComp={ThisContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
