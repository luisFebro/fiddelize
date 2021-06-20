import { useState } from "react";
import useData, { useBizData } from "init";
import Tooltip from "components/tooltips/Tooltip";
import useDatesCountdown from "hooks/dates/useDatesCountdown";
import usePlayAudio from "hooks/media/usePlayAudio";
import GiftBox from "./gift-box/GiftBox";
import QrCodeReceitBtn from "../qr-code-receipt/QrCodeReceiptBtn";

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
    const {
        lastPrizeDate,
        userId,
        currPoints,
        firstName,
        adminGame,
        userGame,
    } = useData();
    const { targetPoints, prizeDeadline, prizeDesc } = adminGame.targetPrize;
    const { challN: currChall } = userGame.targetPrize;

    const {
        themeSColor: colorS,
        themePColor: colorP,
        themeBackColor: colorBack,
    } = useBizData();

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
                    {!finalDeadline && !didPrizeExpired && (
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
        const displayGiftBox = ({
            needSmallBox,
            disableClick = false,
            opacity,
        }) => (
            <GiftBox
                className={`animated ${
                    userBeatedChall
                        ? "bounce repeat-2 delay-3s"
                        : "fadeInUp delay-2s"
                }`}
                boxPColor={colorP}
                backColor={colorBack}
                callback={setIsGiftOpen}
                needSmallBox={needSmallBox}
                prizeDesc={prizeDesc}
                disableClick={disableClick}
                opacity={opacity}
            />
        );

        const challengeInProgress = () => (
            <section className="pt-5">
                <div>
                    <Tooltip
                        needArrow
                        whiteSpace
                        width={325}
                        text={tooltipTxt}
                        element={
                            <div>
                                {displayGiftBox({
                                    needSmallBox: true,
                                    disableClick: true,
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
                    {displayGiftBox({ needSmallBox: false })}
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
