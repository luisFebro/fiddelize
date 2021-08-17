import { useState } from "react";
import useContext from "context";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import getColor from "styles/txt";

const AsyncGamesGalleryContent = Load({
    loader: () =>
        import(
            "./GamesGalleryContent" /* webpackChunkName: "games-gallery-full-page-lazy" */
        ),
});

export default function GamesGalleryBtn({ needClick = true }) {
    const { themeBackColor: colorBack, themeSColor: colorS } = useContext();

    const { txtColorStyle } = getColor(colorS);

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
                onClick={needClick ? handleFullOpen : null}
                title="abrir jogos disponíveis"
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color={txtColorStyle}
                backgroundColor={`var(--themeS--${colorS})`}
                needBtnShadow={false}
                shadowColor={colorBack === "black" ? "white" : "black"}
            />
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
