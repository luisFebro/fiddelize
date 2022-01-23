import { useEffect, useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import parse from "html-react-parser";
import convertToReal from "utils/numbers/convertToReal";
import useContext from "context";
import getPercentage from "utils/numbers/getPercentage";
import animateCart from "./animateCart";
import pickMsg from "./pickMsg";
// import InstructionBtn from "components/buttons/InstructionBtn";

export default function CartRace({
    className,
    targetPoints,
    perc,
    currPoints,
}) {
    const [msg, setMsg] = useState("");
    const { firstName } = useData();
    let { userGame } = useData();
    userGame = userGame || { discountBack: { challN: 1 } };

    const { bizName } = useBizData();
    const { needDark, didUserScroll } = useContext();

    const { challN: currChallenge = 1 } = userGame.discountBack;

    useEffect(() => {
        const { eachMilestone, currLevel } = animateCart({
            currPoints,
            targetPoints,
        });

        const msgOptions = {
            eachMilestone,
            currLevel,
            currPoints,
            currChallenge,
            userName: firstName,
            bizName,
        };

        const thisMsg = pickMsg(msgOptions);
        setMsg(thisMsg);
    }, [firstName, bizName, targetPoints, currPoints, currChallenge]);

    const completePerc = getPercentage(targetPoints, currPoints);

    return (
        <section className={className}>
            <div className="cart-race--root mt-3">
                <LineRoad needDark={needDark} />
                {msg && didUserScroll && (
                    <Fragment>
                        <QuantStatus completePerc={completePerc} />
                        <p className="mot-msg animated fadeInUp text-white delay-3s font-weight-bold mx-3 mt-5 $ text-small text-center text-purple text-shadow">
                            {parse(msg)}
                        </p>
                    </Fragment>
                )}
                <style jsx global>
                    {`
                        .cart-race--root {
                            margin-bottom: 15px;
                        }

                        .cart-race--root .icon {
                            filter: drop-shadow(0.5px 0.5px 1.5px black);
                            color: white;
                            z-index: 15;
                        }

                        .icon-cart {
                            font-size: 45px;
                        }

                        .icon-flag {
                            font-size: 45px;
                        }

                        .mot-msg {
                            position: relative;
                            top: -15px;
                        }

                        ${moveCartCss()}
                        ${paintTrackDotCss(needDark)}
                    `}
                </style>
            </div>
        </section>
    );
}

function QuantStatus({
    completePerc,
    // currPoints,
    // targetPoints,
    // perc,
}) {
    // const isDecimal = completePerc && completePerc.toString().includes(".");
    return (
        <section className="font-site text-shadow quant-status text-center animated fadeInUp delay-2s my-5 d-flex justify-content-around align-items-center">
            <div>
                <p className="m-0 text-em-4">
                    {Number.isNaN(completePerc) ? "..." : completePerc}%
                </p>
                <div className="title text-normal">concluído</div>
            </div>
            <style jsx>
                {`
                    .quant-status {
                        color: #ff0;
                    }

                    .quant-status .title {
                        position: relative;
                        top: -15px;
                    }
                `}
            </style>
        </section>
    );
}

function LineRoad({ needDark }) {
    return (
        <section className="track-line">
            <div id="cart" className="cart animated bounce anima-iteration-2">
                <FontAwesomeIcon
                    className="icon icon-cart"
                    icon="shopping-cart"
                />
            </div>

            <div id="track1" className="vertical-line">
                <p className="start-spot" />
                <p id="dot1" className="spot first" />
            </div>
            <div id="track2" className="track">
                <p id="dot2" className="spot" />
            </div>
            <div id="track3" className="track">
                <p id="dot3" className="spot" />
            </div>
            <div id="track4" className="track">
                <p id="dot4" className="spot" />
            </div>
            <div id="track5" className="track track-flag position-relative">
                <div id="win-flag" className="flag position-absolute">
                    <FontAwesomeIcon
                        className="icon icon-flag"
                        icon="flag-checkered"
                    />
                </div>
                <p id="dot5" className="spot" />
            </div>

            <style jsx>
                {`
                    .track-line {
                        position: relative;
                        margin: 0 30px;
                        display: flex;
                        justify-content: center;
                    }

                    .track-line .vertical-line {
                        background: ${needDark ? "var(--lightGrey)" : "grey"};
                        position: absolute;
                        top: -55px;
                        left: 0px;
                        width: 10px;
                        height: 65px;
                        z-index: 1;
                    }

                    .track-line .vertical-line .start-spot {
                        background: #ff0;
                        position: absolute;
                        transform: rotate(90deg);
                        top: -15px;
                        left: -2px;
                        height: 30px;
                        width: 15px;
                        border-radius: 50% 50%;
                    }

                    .track-line .track {
                        position: relative;
                        background: ${needDark ? "var(--lightGrey)" : "grey"};
                        height: 10px;
                        width: 70%;
                        z-index: -1;
                    }

                    .track-line .track .spot {
                        background: ${needDark ? "var(--lightGrey)" : "grey"};
                        position: absolute;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        right: -3px;
                        top: -8px;
                        z-index: 1;
                    }

                    .track-line .spot.first {
                        background: ${needDark ? "var(--lightGrey)" : "grey"};
                        position: absolute;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        bottom: -23px;
                        left: -7px;
                    }

                    .cart-race--root .cart {
                        position: absolute;
                        top: -100px;
                        left: -20px;
                        z-index: 3;
                    }

                    .track-flag .flag {
                        z-index: 3;
                        position: absolute;
                        top: -45px;
                        right: -25px;
                    }
                `}
            </style>
        </section>
    );
}

const Y_POS = "64px";
// CSS
function moveCartCss() {
    return `
        .move-down {
            animation: moveDown 1s ease-out 2s 1 normal forwards;
            transition: transform 1s;
        }

        .move-down-left {
            animation: moveDownLeft 3s ease-out 2s 1 normal forwards;
            transition: transform 1s;
        }

        .move-down-left-two {
            animation: moveDownLeftTwo 3s ease-out 2s 1 normal forwards;
            transition: transform 1s;
        }

        .move-down-left-three {
            animation: moveDownLeftThree 3s ease-out 2s 1 normal forwards;
            transition: transform 1s;
        }

        .move-down-left-final {
            animation: moveDownLeftFinal 3s ease-out 2s 1 normal forwards;
            transition: transform 1s;
        }

        .move-flag-top {
            animation: moveFlagTop 1s ease-out 2s 1 normal forwards;
            transition: transform 3s;
        }

        @keyframes moveFlagTop {
            0% { transform: translateY(0); }
            100% { transform: translate(-40px, -30px) rotateY(180deg); }
        }

        @keyframes moveDown {
            0% { transform: translateY(0); }
            100% { transform: translate(0, ${Y_POS}); }
        }

        ${moveDownLeft("17vw")}

        ${moveDownLeftTwo("37vw")}

        ${moveDownLeftThree("57vw")}

        ${moveDownLeftFinal("79vw")}

        @media only screen and (min-width: 450px) {
            ${moveDownLeftTwo("40vw")}
            ${moveDownLeftThree("60vw")}
            ${moveDownLeftFinal("84vw")}
        }

        @media only screen and (min-width: 550px) {
            ${moveDownLeftThree("62vw")}
            ${moveDownLeftFinal("86vw")}
        }

        @media only screen and (min-width: 650px) {
            ${moveDownLeft("19vw")}
            ${moveDownLeftTwo("42vw")}
            ${moveDownLeftThree("66vw")}
            ${moveDownLeftFinal("88vw")}
        }

        @media only screen and (min-width: 750px) {
            ${moveDownLeft("22vw")}
            ${moveDownLeftTwo("44vw")}
            ${moveDownLeftFinal("90vw")}
        }

        @media only screen and (min-width: 900px) {
            ${moveDownLeftThree("69vw")}
            ${moveDownLeftFinal("92vw")}
        }

        @media only screen and (min-width: 1100px) {
            ${moveDownLeftTwo("46vw")}
            ${moveDownLeftFinal("93vw")}
        }
    `;
}

function paintTrackDotCss(needDark) {
    return `
        .paint-track {
            animation: paintTrack 3s ease-out 1 normal forwards;
            transition: all 1s;
        }

        .paint-dot {
            animation: paintDot 3s ease-out 1 normal forwards;
            transition: all 1s;
        }

        @keyframes paintTrack {
            0% { background-color: var(--mainWhite);  }
            100% {
                background-color: rgba(250, 250, 0);
            }
        }

        @keyframes paintDot {
            0% { background-color: var(--mainWhite);  }
            100% {
                background-color: rgba(250, 250, 0);
                border-radius: 50%;
                height: 25px;
                width: 25px;
                filter: drop-shadow(${needDark ? "grey 0px 0px 4px" : ""});
            }
        }
    `;
}

function moveDownLeft(xPos) {
    return `
        @keyframes moveDownLeft {
            0% { transform: translateY(0); }
            50% { transform: translate(0, ${Y_POS}); }
            100% { transform: translate(${xPos}, ${Y_POS}); }
        }
    `;
}

function moveDownLeftTwo(xPos) {
    return `
        @keyframes moveDownLeftTwo {
            0% { transform: translateY(0); }
            25% { transform: translate(0, ${Y_POS}); }
            100% { transform: translate(${xPos}, ${Y_POS}); }
        }
    `;
}

function moveDownLeftThree(xPos) {
    return `
        @keyframes moveDownLeftThree {
            0% { transform: translateY(0); }
            25% { transform: translate(0, ${Y_POS}); }
            100% { transform: translate(${xPos}, ${Y_POS}); }
        }
    `;
}

function moveDownLeftFinal(xPos) {
    return `
        @keyframes moveDownLeftFinal {
            0% { transform: translateY(0); }
            20% { transform: translate(0, ${Y_POS}); }
            100% { transform: translate(${xPos}, ${Y_POS}); }
        }
    `;
}
// END CSS

/* ARCHIVES

<div className="position-relative">
    <p
        className={`m-0 ${
            accuMoney <= 1000 ? "text-em-3" : "text-em-2"
        }`}
    >
        {convertToReal(accuMoney, { moneySign: true })}
    </p>
    <div className="title text-normal">acumulado</div>
    {showInstruBtn()}
</div>

const showInstruBtn = () => {
    const text = `
        O valor de R$ ${accuMoney} foi convertido automaticamente do seu saldo em pontos atual de ${currPoints} PTS.
        <br /><br />
        Você acumula <span class="font-weight-bold">${perc}% de desconto a cada compra</span>.
        <br /><br />
        Você pode usar seu vale desconto assim que bater a <strong>meta resgate de ${targetPoints} PTS</strong>.
        <br /><br />
        Lembre-se que 1 PTS vale R$ 1.
        <br />
        Obrigada por comprar com a gente!
    `;

    return (
        <div className="instr-acc-btn position-absolute enabled-click">
            <InstructionBtn mode="tooltip" text={text} />
            <style jsx>
                {`
                    .instr-acc-btn {
                        top: -25px;
                        right: -25px;
                    }
                `}
            </style>
        </div>
    );
};

 */
