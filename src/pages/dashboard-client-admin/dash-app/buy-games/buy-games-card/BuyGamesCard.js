import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import InstructionBtn from "components/buttons/InstructionBtn";
import { useBizData } from "init";
import getGameCardData from "./getGameCardData";
import "./_Card.scss";

const isSmall = window.Helper.isSmallScreen();

export default function BuyGamesCard(props) {
    const [loading, setLoading] = useState(false);

    const { setComp, gameData } = props;

    const { themeBackColor, themePColor, themeSColor } = useBizData();
    const { gameName, on } = gameData;

    const isDisabled = !on;

    const { nameBr, icon, article } = getGameCardData({
        isAdmin: true,
        gameName,
        isDisabled,
    });

    const mainCtaTitle = "opções";
    const showCTA = () => (
        <ButtonFab
            title={loading ? "iniciando..." : mainCtaTitle}
            variant="extended"
            size="small"
            width="100%"
            position="relative"
            backgroundColor={`var(--themeS--${themeSColor})`}
            onClick={async () => {
                setLoading(true);
                setComp({
                    name: gameName,
                    props,
                });
                setLoading(false);
            }}
        />
    );

    const showStatusBadge = () => (
        <section
            className={`font-site text-em-0-9 ${
                isDisabled ? "text-grey" : "text-sys-green"
            } font-weight-bold buy-game-badge`}
        >
            {isDisabled ? "desativado" : "ativo"}
            <style jsx>
                {`
                    .buy-game-badge {
                        background-color: "var(--lightGrey)";
                        padding: 5px 10px;
                        border-radius: 5px;
                    }
                `}
            </style>
        </section>
    );

    const showFooter = () => (
        <section className="card-footer">
            <p
                className="m-0 desc font-weight-bold"
                style={{
                    color: isDisabled
                        ? "#808080cf"
                        : `var(--themePDark--${themePColor})`,
                }}
            >
                {nameBr}
            </p>
            <div className="container-center">{showStatusBadge()}</div>
            <div className="container-center">{showCTA()}</div>
        </section>
    );

    const disableArticleBtn = gameName === "balloonPop";
    const showArticleBtn = () => (
        <InstructionBtn mode="modal" article={article} />
    );

    return (
        <main
            className="col-6 mx-auto mb-4" // not using  col-md-4  col-lg-3 since it is in a modal, only 2 columns of 6 / 6 from 12
        >
            <section
                className="position-relative shadow-babadoo card--root"
                style={{
                    minWidth: isSmall ? undefined : 150,
                }}
            >
                <div className="about-btn position-absolute">
                    {!disableArticleBtn && showArticleBtn()}
                </div>
                <div
                    className="img-container p-4 p-sm-3"
                    style={{
                        background: `var(--themePLight--default)`,
                    }}
                >
                    {icon}
                </div>
                {showFooter()}
                <style jsx>
                    {`
                        .about-btn {
                            top: -15px;
                            right: -10px;
                        }
                    `}
                </style>
            </section>
        </main>
    );
}
// END HELPERS

/* ARCHIVES
const text = `
    <p class="text-center">${nameBr && nameBr.toUpperCase()}</p>
    ${concept}
    <br />
    <br />
    STATUS: disponível.
`;
 */
