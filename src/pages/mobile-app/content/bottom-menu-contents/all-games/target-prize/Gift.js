import { useState } from "react";
import useContext from "context";
import useData from "init";
import Tooltip from "components/tooltips/Tooltip";
import usePlayAudio from "hooks/media/usePlayAudio";
import getQueryByName from "utils/string/getQueryByName";
import GiftBox from "./gift-box/GiftBox";
import QrCodeReceitBtn from "../qr-code-receipt/QrCodeReceiptBtn";
import ExpiringBenefitBadge from "../_comps/ExpiringBenefitBadge";

export default function Gift() {
    const { adminGame, userGame } = useData();
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

    const prizeImg = adminGame.targetPrize && adminGame.targetPrize.prizeImg;

    const { challN: currChall = 1 } = userGame.targetPrize;

    const [isGiftOpen, setIsGiftOpen] = useState(false);

    usePlayAudio("/sounds/gift-box-opening.mp3", ".gift-box--sound");

    const userBeatedChall = currPoints >= targetPoints;

    const tooltipTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO N.º ${currChall}</p>
        • ${firstName}, você ganha <strong>${prizeDesc}</strong> ao concluir este desafio.
        <br />
    `;

    const showPrizeDeadline = () => (
        <section
            className="position-absolute animated zoomIn delay-2s"
            style={{
                zIndex: 1000,
                bottom: "5%",
                left: "55%",
                display: isGiftOpen ? "block" : "none",
            }}
        >
            <div className="position-relative">
                <QrCodeReceitBtn type="receiptText" />
                <ExpiringBenefitBadge />
            </div>
        </section>
    );

    const showGift = () => {
        const displayGiftBox = ({ needSmallBox, disableOpenBox, opacity }) => (
            <GiftBox
                className={`animated ${
                    userBeatedChall
                        ? "bounce repeat-2 delay-3s"
                        : `${prizeImg ? "" : "fadeInUp delay-2s"}`
                }`}
                boxPColor={colorP}
                backColor={colorBack}
                callback={setIsGiftOpen}
                disableOpenBox={disableOpenBox}
                needSmallBox={needSmallBox}
                prizeDesc={prizeDesc}
                targetPoints={targetPoints}
                prizeImg={prizeImg}
                opacity={opacity}
                didBeatGame={currPoints >= targetPoints}
                isCliApp
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
                {prizeImg ? (
                    <div className="enabled-click">
                        {displayGiftBox({
                            needSmallBox: true,
                            disableOpenBox: !prizeImg,
                            opacity: 1,
                        })}
                        <p className="text-grey font-site text-em-1-1">
                            Clique na caixa
                        </p>
                    </div>
                ) : (
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
                                        disableOpenBox: !prizeImg,
                                        opacity: 1,
                                    })}
                                </div>
                            }
                            backgroundColor={`var(--themeS--${colorS})`}
                            colorS={colorS}
                        />
                    </div>
                )}
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
