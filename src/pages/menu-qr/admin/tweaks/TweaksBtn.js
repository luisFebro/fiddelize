import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncContent = Load({
    loader: () =>
        import("./TweaksContent" /* webpackChunkName: "tweaks-content-lazy" */),
});

export default function TweaksBtn() {
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
                onClick={handleFullOpen}
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="cog"
                        style={{
                            fontSize: 30,
                            color: "var(--mainWhite)",
                        }}
                    />
                }
                size="medium"
                color="white"
                backgroundColor="var(--themePDark)"
            />
            <ModalFullContent
                contentComp={<AsyncContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
