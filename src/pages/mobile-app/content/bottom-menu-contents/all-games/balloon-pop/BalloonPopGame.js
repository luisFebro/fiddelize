import { Fragment, useState, useEffect, useCallback } from "react";
import useBackColor from "hooks/useBackColor";
import getId from "utils/getId";
import useAPI, { getBalloonPopData } from "api/useAPI";
import usePlayAudio from "hooks/media/usePlayAudio";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import getItems, { setItems, removeItems } from "init/lStorage";
import { addMinutes, hasPassedDate } from "utils/dates/dateFns";
import useTxtToSpeech from "hooks/media/useTxtToSpeech";
import ModalCenter from "./ModalCenter";
import useAnimateBalloon from "./useAnimateBalloon";
import Balloon from "./balloon/Balloon";

export default function BalloonPopGame({ match }) {
    const bizLinkName = match && match.params.bizLinkName;

    const [triggerConfetti, setTriggerConfetti] = useState(false);
    const [pendingBenefit, setPendingBenefit] = useState(null);

    const speaker = useTxtToSpeech(
        "Clique em cima de um balão para estourar e ganhar um benefício instantâneo!"
    );

    const confettiOptions = useCallback(
        () => ({ trigger: triggerConfetti, maxTimeSec: 25000 }),
        [triggerConfetti]
    );
    useAnimateConfetti(confettiOptions());

    const { data, loading } = useAPI({
        url: getBalloonPopData(),
        params: {
            bizLinkName,
        },
        trigger: true,
    });

    const balloonList = data && data.list;
    const backColor = (data && data.backColor) || "default";
    const isGameOn = data && data.isGameOn;

    usePendingBenefitChecker({
        setPendingBenefit,
    });
    useBackColor(`var(--themeBackground--${backColor})`);
    usePlayAudio("/sounds/game/balloon-pop.mp3", ".balloon-pop--audio", {
        trigger: backColor,
    });

    useAnimateBalloon(backColor);

    // if this returns, the balloons are not animated
    // if(loading) {
    //     return(
    //         <div
    //             style={{ marginTop: 150, backgroundColor: "var(--mainDark)" }} className="text-normal text-pill text-white text-center">
    //             Carregando...
    //         </div>
    //     );
    // }

    if (!loading && !isGameOn) {
        return (
            <div
                style={{ marginTop: 150, backgroundColor: "var(--mainDark)" }}
                className="text-normal text-pill text-white text-center"
            >
                No momento, este jogo está desativado
            </div>
        );
    }

    return (
        <Fragment>
            <div className="container-center mt-2 mb-5">
                <h1
                    className="text-center text-normal text-pill"
                    style={{
                        backgroundColor: "#000",
                    }}
                >
                    Clique para estourar um balão
                </h1>
            </div>
            {balloonList &&
                balloonList.map((balloon, ind) => (
                    <section key={ind} className="balloon-pop--audio">
                        <EachBalloon
                            {...balloon}
                            backColor={backColor}
                            setTriggerConfetti={setTriggerConfetti}
                            speaker={speaker}
                        />
                    </section>
                ))}
            {pendingBenefit && (
                <ShowBenefitPanel
                    desc={pendingBenefit && pendingBenefit.desc}
                    fullOpen
                    backColor={backColor}
                />
            )}
        </Fragment>
    );
}

function EachBalloon({
    id,
    desc,
    backColor,
    color,
    top,
    left,
    setTriggerConfetti,
    speaker,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleClose = () => {
        setFullOpen(false);
    };

    const dataPanel = {
        desc,
        fullOpen,
        handleClose,
        backColor,
    };

    return (
        <Fragment>
            <section
                className={`balloon-w-${id}`}
                onClick={() => {
                    setTimeout(() => setFullOpen(true), 1000);
                    setTriggerConfetti(true);
                    setItems("global", {
                        tempBalloonData: {
                            expDate: addMinutes(new Date(), 30),
                            desc,
                            backColor,
                        },
                    });
                    speaker(`Opaaa! Parabéns! Você ganhou ${desc}`);
                }}
            >
                <Balloon balloonColor={color} balloonId={getId()} />
                <style jsx>
                    {`
                        .balloon-w-${id} {
                            position: relative;
                            top: ${top}px;
                            left: ${left}px;
                        }
                    `}
                </style>
            </section>
            {fullOpen && <ShowBenefitPanel {...dataPanel} />}
        </Fragment>
    );
}

// HOOKS
function usePendingBenefitChecker({ setPendingBenefit }) {
    useEffect(() => {
        const [tempBalloonData] = getItems("global", ["tempBalloonData"]);
        if (!tempBalloonData) return;

        const expDate = tempBalloonData && tempBalloonData.expDate;
        const desc = tempBalloonData && tempBalloonData.desc;
        const backColor = tempBalloonData && tempBalloonData.backColor;

        const hasPassed = hasPassedDate(expDate);

        if (hasPassed) {
            removeItems("global", ["tempBalloonData"]);
        } else {
            setPendingBenefit({
                desc,
                backColor,
            });
        }
    }, []);
}

function ShowBenefitPanel({ desc, fullOpen, handleClose, backColor }) {
    return (
        <section className="benefit-dialog">
            <ModalCenter
                title="Você ganhou benefício:"
                subtitle={desc}
                fullOpen={fullOpen}
                setFullOpen={handleClose}
                backColor={backColor}
            />
            <style jsx global>
                {`
                    .MuiDialog-paperWidthMd {
                        max-width: none !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                    }

                    .MuiDialog-paper {
                        margin: 150px 0 !important;
                        position: relative;
                        overflow-y: auto;
                    }

                    .MuiTypography-root div {
                        max-width: 330px;
                    }
                `}
            </style>
        </section>
    );
}

/* ARCHIVES

<img
    className="img-center my-3"
    src="/img/logo/logo-icon.png"
    width={100}
    style={{
        maxHeight: 100,
    }}
    alt="logo"
/>

*/
