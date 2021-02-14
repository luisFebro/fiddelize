import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../components/modals/ModalFullContent";
import { Load } from "../../../components/code-splitting/LoadableComp";
import ButtonMulti, {
    faStyle as faStyleMulti,
} from "../../../components/buttons/material-ui/ButtonMulti";

const AsyncTestMode = Load({
    loader: () =>
        import(
            "./AsyncTestModeContent" /* webpackChunkName: "test-mode-page-lazy" */
        ),
});

export default function PurchaseHistoryBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
    isMainBtn = false,
    from = "mobileApp", // removed discount scores from client hisotry
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            {isMainBtn ? (
                <ButtonFab
                    backgroundColor="var(--themeSDark)"
                    position="relative"
                    size="medium"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="mobile-alt" style={faStyle} />
                    }
                    onClick={handleFullOpen}
                />
            ) : (
                <ButtonMulti
                    onClick={handleFullOpen}
                    title="resultado"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon="mobile-alt"
                            style={faStyleMulti}
                        />
                    }
                />
            )}
            <ModalFullContent
                contentComp={<AsyncTestMode />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
