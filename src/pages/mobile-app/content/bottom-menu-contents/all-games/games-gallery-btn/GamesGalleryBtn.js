import { useState } from "react";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { currTxtColor } from "utils/biz/selectTxtStyle";

const AsyncGamesGalleryContent = Load({
    loader: () =>
        import(
            "./GamesGalleryContent" /* webpackChunkName: "games-gallery-full-page-lazy" */
        ),
});

export default function GamesGalleryBtn() {
    const { themeBackColor: colorBack, themeSColor: colorS } = useBizData();

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const thisCurrTxtColor = currTxtColor(colorBack);

    return (
        <section>
            <div className="animated fadeInUp delay-3s">
                <ButtonFab
                    position="relative"
                    onClick={handleFullOpen}
                    title="galeria de jogos"
                    iconFontSize="25px"
                    variant="extended"
                    fontWeight="bolder"
                    fontSize=".9em"
                    size="large"
                    color={thisCurrTxtColor}
                    backgroundColor={`var(--themeS--${colorS})`}
                    shadowColor={colorBack === "black" ? "white" : "black"}
                />
            </div>
            <ModalFullContent
                contentComp={
                    <AsyncGamesGalleryContent closeModal={handleFullClose} />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
