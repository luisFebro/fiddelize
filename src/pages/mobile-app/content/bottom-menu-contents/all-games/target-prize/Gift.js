import { useState } from "react";
import useContext from "context";
import Tooltip from "components/tooltips/Tooltip";
import useDatesCountdown from "hooks/dates/useDatesCountdown";
import usePlayAudio from "hooks/media/usePlayAudio";
import GiftBox from "./gift-box/GiftBox";

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

export default function Gift({
    rewardDeadline,
    prizeDesc,
    arePrizesVisible,
    userId,
}) {
    const {
        currPoints,
        currChall,
        targetPoints,
        colorS,
        colorP,
        colorBack,
        userName,
        lastPrizeDate,
        // playBeep,
    } = useContext();

    const [isGiftOpen, setIsGiftOpen] = useState(false);

    usePlayAudio("/sounds/gift-box-opening.mp3", ".gift-box--sound");

    const userBeatedChall = currPoints >= targetPoints;

    const finalDeadline = useDatesCountdown({
        deadline: rewardDeadline,
        userId,
        date: lastPrizeDate,
    });
    const didPrizeExpired = finalDeadline === 0;

    const styles = getStyles({
        didPrizeExpired,
        colorS,
    });

    const visibleTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO N.º ${currChall}</p>
        • ${userName}, você ganha <strong>${prizeDesc}</strong> ao concluir este desafio.
        <br />
    `;

    const hiddenTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO N.º ${currChall}</p>
        • ${userName}, o prêmio é uma surpresa e será revelado assim que este desafio for concluído.
        <br />
    `;
    const tooltipTxt = arePrizesVisible ? visibleTxt : hiddenTxt;

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
            <section className={!arePrizesVisible ? "shake-it pt-5" : "pt-5"}>
                <div className="position-relative">
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
                                    opacity:
                                        userBeatedChall || arePrizesVisible
                                            ? 1
                                            : 0.5,
                                })}
                            </div>
                        }
                        backgroundColor={`var(--themeS--${colorS})`}
                        colorS={colorS}
                    />
                    {!arePrizesVisible && (
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
                </div>
            </section>
        );

        const beatedChallenge = () => (
            <section>
                <p className="animated fadeInUp delay-2s pb-2 text-title text-shadow text-subtitle font-weight-bold">
                    Parabéns, {userName}!
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
