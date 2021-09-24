import { useState } from "react";
import useContext from "context";
import useData from "init";
import Tooltip from "components/tooltips/Tooltip";
import useDatesCountdown from "hooks/dates/useDatesCountdown";
import usePlayAudio from "hooks/media/usePlayAudio";
import GiftBox from "./gift-box/GiftBox";
import QrCodeReceitBtn from "../qr-code-receipt/QrCodeReceiptBtn";
import getQueryByName from "utils/string/getQueryByName";

const getStyles = (props) => ({
    deadlineBoard: {
        borderRadius: "30px",
        backgroundColor: props.didPrizeExpired
            ? "var(--expenseRed)"
            : `var(--themeSDark--${props.colorS})`,
        border: "3px solid white",
    },
    timerIcon: {
        top: "-25px",
        left: "-25px",
    },
    deadlineTitle: {
        top: "-25px",
        left: "15px",
    },
});

export default function Gift() {
    const { lastPrizeDate, userId, adminGame, userGame } = useData();
    const { prizeDeadline = 30 } = adminGame.targetPrize;
    const {
        firstName,
        currPoints,
        themeSColor: colorS,
        themePColor: colorP,
        themeBackColor: colorBack,
        targetPointsPreview,
    } = useContext();
    const prizeDescPreview = getQueryByName("prizeDesc");

    const targetPoints =
        targetPointsPreview ||
        (adminGame.targetPrize && adminGame.targetPrize.targetPoints);
    const prizeDesc =
        prizeDescPreview ||
        (adminGame.targetPrize && adminGame.targetPrize.prizeDesc);
    const { challN: currChall = 1 } = userGame.targetPrize;

    const [isGiftOpen, setIsGiftOpen] = useState(false);

    usePlayAudio("/sounds/gift-box-opening.mp3", ".gift-box--sound");

    const userBeatedChall = currPoints >= targetPoints;

    const finalDeadline = useDatesCountdown({
        deadline: prizeDeadline,
        userId,
        date: lastPrizeDate,
    });
    const didPrizeExpired = finalDeadline === 0;

    const styles = getStyles({
        didPrizeExpired,
        colorS,
    });

    const tooltipTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO N.º ${currChall}</p>
        • ${firstName}, você ganha <strong>${prizeDesc}</strong> ao concluir este desafio.
        <br />
    `;

    const plural = finalDeadline > 1 ? "s" : "";
    const showPrizeDeadline = () => (
        <section
            className="position-absolute animated zoomIn delay-2s"
            style={{
                zIndex: 1000,
                bottom: "5%",
                left: "66%",
                display: isGiftOpen ? "block" : "none",
            }}
        >
            <div className="position-relative">
                <div style={styles.deadlineBoard}>
                    {!finalDeadline && ( // && !didPrizeExpired
                        <p className="m-0 mx-3 text-subtitle text-white text-shadow text-center text-nowrap">
                            30 dias
                        </p>
                    )}

                    {Boolean(finalDeadline) && (
                        <p className="m-0 mx-3 text-subtitle text-white text-shadow text-center text-nowrap">
                            {didPrizeExpired
                                ? "expirou"
                                : `${finalDeadline} dia${plural}`}
                        </p>
                    )}
                </div>
                <QrCodeReceitBtn type="receiptText" />
                <p
                    className="text-small text-center font-weight-bold position-absolute text-nowrap"
                    style={styles.deadlineTitle}
                >
                    Prazo Resgate
                </p>
                <div className="position-absolute" style={styles.timerIcon}>
                    <img
                        className="shadow-elevation-white"
                        src="/img/icons/timer.svg"
                        alt="relógio"
                        width={45}
                        height={45}
                    />
                </div>
            </div>
        </section>
    );

    const showGift = () => {
        const displayGiftBox = ({ needSmallBox, disableOpenBox, opacity }) => (
            <GiftBox
                className={`animated ${
                    userBeatedChall
                        ? "bounce repeat-2 delay-3s"
                        : "fadeInUp delay-2s"
                }`}
                boxPColor={colorP}
                backColor={colorBack}
                callback={setIsGiftOpen}
                disableOpenBox={disableOpenBox}
                needSmallBox={needSmallBox}
                prizeDesc={prizeDesc}
                opacity={opacity}
            />
        );

        const exceptionColor = colorP === "white" || colorP === "yellow";
        const challengeInProgress = () => (
            <section
                className="position-relative"
                style={{
                    top: -50,
                }}
            >
                <p
                    className="position-relative animated fadeInUp delay-2s py-5 text-title text-shadow text-subtitle font-weight-bold"
                    style={{
                        top: -30,
                        bottom: 50,
                    }}
                >
                    alcance{" "}
                    <span className="text-title">{targetPoints} PTS</span>
                    <br />
                    e ganhe prêmio:
                    <br />
                    <div className="container-center">
                        <span
                            className="d-table text-pill"
                            style={{
                                backgroundColor: `var(--themeP${
                                    exceptionColor ? "Dark" : ""
                                }--${colorP})`,
                            }}
                        >
                            {prizeDesc}
                        </span>
                    </div>
                </p>
                <div className="enabled-click">
                    <Tooltip
                        needArrow
                        whiteSpace
                        width={325}
                        text={tooltipTxt}
                        element={
                            <div>
                                {displayGiftBox({
                                    needSmallBox: true,
                                    disableOpenBox: true,
                                    opacity: 1,
                                })}
                            </div>
                        }
                        backgroundColor={`var(--themeS--${colorS})`}
                        colorS={colorS}
                    />
                </div>
            </section>
        );

        const beatedChallenge = () => (
            <section>
                <p className="animated fadeInUp delay-2s pb-2 text-title text-shadow text-subtitle font-weight-bold">
                    Parabéns, {firstName}!
                    <br />
                    <p className="text-normal">Abra seu prêmio.</p>
                </p>
                <section className="pt-5 d-block position-relative">
                    {displayGiftBox({
                        needSmallBox: false,
                        disableOpenBox: false,
                    })}
                    {showPrizeDeadline()}
                </section>
            </section>
        );

        return (
            <section className="container-center">
                {userBeatedChall ? beatedChallenge() : challengeInProgress()}
            </section>
        );
    };

    return (
        <div className="text-white text-center gift-box--sound">
            {showGift()}
        </div>
    );
}

/* ARCHIVES

{!arefsdfdsPrizesVisible && (
    <p
        className="text-hero animated fadeIn delay-3s"
        style={{
            fontSize: 80,
            position: "absolute",
            top: "-10%",
            left: "60%",
            transform: "translateX(-60%)",
        }}
    >
        ?
    </p>
)}

 */
