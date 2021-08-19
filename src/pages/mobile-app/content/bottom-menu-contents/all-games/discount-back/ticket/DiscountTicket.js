import { useState, useRef, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CloseButton from "components/buttons/CloseButton";
import useData, { useBizData } from "init";
import QrCode from "components/QrCode";
import LocalMallTwoToneIcon from "@material-ui/icons/LocalMallTwoTone";
import removeImgFormat from "utils/biz/removeImgFormat";
import QrCodeReceiptBtn from "../../qr-code-receipt/QrCodeReceiptBtn";
// import { encrypt } from "utils/security/xCipherFront";

export default function DiscountTicket({
    didBeatGame = false,
    perc,
    ticketAmount,
}) {
    const [openCard, setOpenCard] = useState(false);

    const { bizName, bizLogo, themePColor } = useBizData();
    const { name, sexLetter, userId } = useData();

    const mainColor = `var(--themePLight--${themePColor})`;
    const pColor = `var(--themePDark--${themePColor})`;
    const isShe = sexLetter === "a";

    const discountCardRef = useRef({});

    const toggleOpen = () => {
        const cardElem = discountCardRef.current;

        if (cardElem) cardElem.classList.toggle("open");
        setOpenCard((prev) => !prev);
    };

    const showCTA = () => (
        <div className="animated wobble delay-3s repeat-2 discount-tix-btn position-absolute">
            <ButtonFab
                title="usar valor"
                onClick={toggleOpen}
                backgroundColor={`var(--themeSDark--${themePColor})`}
                size="medium"
                variant="extended"
                needTxtNoWrap
            />
            <style jsx>
                {`
                    .discount-tix-btn {
                        bottom: 60px;
                        right: 160px;
                    }
                    @media only screen and (min-width: 768px) {
                        .discount-tix-btn {
                            right: 170px;
                        }
                    }
                `}
            </style>
        </div>
    );

    const showOffBadge = () => (
        <div className="unava-card position-absolute">
            <p className="text-pill text-normal text-shadow">Em progresso</p>
            <style jsx>
                {`
                    .unava-card {
                        bottom: 10px;
                        right: 25px;
                    }

                    .unava-card p {
                        background: black;
                    }
                `}
            </style>
        </div>
    );

    const showCloseBtn = () => (
        <CloseButton
            delay={3000}
            color={null}
            position="absolute"
            bottom={-15}
            right={-15}
            onClick={toggleOpen}
        />
    );

    const condOpenCard = !openCard && showCTA();

    const { newImg, isSquared } = removeImgFormat(bizLogo);
    const imageSettings = {
        src: newImg,
    };

    const showEachBuyPercBadge = () => (
        <div className="each-buy-perc--root position-relative animated fadeIn delay-1s container-center">
            <div className="mx-2 each-buy-perc text-white text-pill text-shadow font-site text-em-1-1 text-center">
                <LocalMallTwoToneIcon className="mr-2" />
                Amig{sexLetter || "o"}, acumule {perc}%
                <br />
                de desconto a cada nova compra
            </div>
            <style jsx>
                {`
                    .each-buy-perc--root {
                        top: -80px;
                    }
                    .each-buy-perc {
                        padding: 5px 15px;
                        background: ${mainColor};
                    }

                    .each-buy-perc svg {
                        font-size: 30px;
                    }
                `}
            </style>
        </div>
    );

    const qrCode = `buy_games::customerId:${userId};customerName:${name};`;

    // LESSON: when dealing with 2 classes which requires diff styles
    // do not put a number to the first elem like: class="elem elem-1" class="elem elem-2"
    // instead write class="elem" class="elem elem-2" so you will have the default elem style on both and elem-2 will take care the diff style of second elem and so on
    return (
        <Fragment>
            <section
                className={`${
                    openCard ? "backdrop-medium" : "position-relative"
                } container-center-col font-site`}
                style={{
                    top: -60,
                }}
            >
                <section
                    ref={discountCardRef}
                    className={`${
                        didBeatGame ? "" : "shake-it"
                    } discount-card position-relative`}
                >
                    <div className="tix">
                        <div className="tix-inner text-shadow">
                            <span className="discount-title text-em-2 position-relative">
                                Vale Desconto
                                <span className="value position-relative d-block text-em-1-8">
                                    R$ {ticketAmount}
                                </span>
                            </span>
                        </div>
                        {didBeatGame ? condOpenCard : showOffBadge()}
                    </div>
                    <div className="tix tix-2 shadow-babadoo-filter position-relative">
                        <div className="tix-inner text-shadow">
                            <span
                                className={`${
                                    openCard ? "d-block" : "d-none"
                                } mx-3 text-em-1-1 position-relative`}
                            >
                                <h2 className="pt-1 text-subtitle text-center font-weight-bold">
                                    Comprovante
                                </h2>
                                <section className="d-flex">
                                    <div className="position-relative">
                                        <QrCode
                                            size={100}
                                            value={qrCode}
                                            fgColor={pColor}
                                            imageSquare={isSquared}
                                            imageSettings={imageSettings}
                                        />
                                        <QrCodeReceiptBtn />
                                    </div>
                                    <p className="m-0 ml-3 text-normal">
                                        {`Ganhador${isShe ? "a:" : ":"}`}
                                        <span
                                            className="d-block text-subtitle"
                                            style={{
                                                lineHeight: "27px",
                                            }}
                                        >
                                            {name}
                                        </span>
                                    </p>
                                </section>
                                <span className="position-relative pt-1 instru-txt d-block text-center text-small">
                                    Para receber seu vale, mostre o comprovante
                                    na {bizName}
                                </span>
                            </span>
                        </div>
                    </div>
                    {openCard && showCloseBtn()}
                </section>
            </section>
            {!openCard && showEachBuyPercBadge()}
            <style jsx>
                {`
                .tix {
                    width: 306px;
                    height: 204px;
                    transition: 0.5s;
                    position: relative;
                    z-index: 10;
                    transform: translateY(100px);

                    bacground: none;
                    //background:
                         -webkit-radial-gradient(0 100%, circle, rgba(204,204,204,0) 14px, var(--lightGrey) 15px),
                         -webkit-radial-gradient(100% 100%, circle, rgba(204,204,204,0) 14px, var(--lightGrey) 15px),
                         -webkit-radial-gradient(100% 0, circle, rgba(204,204,204,0) 14px, var(--lightGrey) 15px),
                         -webkit-radial-gradient(0 0, circle, rgba(204,204,204,0) 14px, var(--lightGrey) 15px);
                }

                .tix-2 {
                    z-index: 5;
                    position: relative; /* LESSON: for z-index works properly, position: relative is required */
                    transform: translateY(-100px);
                    background: none;
                }

                .discount-card.open .tix, .discount-card.open .tix-2 {
                    transform: translateY(0px);
                }

                .tix:before {
                    content: "";
                    display: block;
                    width: 300px;
                    height: 200px;
                    position: absolute;
                    left: 0px;
                    z-index: 0;
                    background:
                       -webkit-radial-gradient(0 100%, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                            -webkit-radial-gradient(100% 100%, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                            -webkit-radial-gradient(100% 0, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                            -webkit-radial-gradient(0 0, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px);
                }

                .tix-2:before {
                    background:
                       -webkit-radial-gradient(0 100%, circle, rgba(204,102,153,0) 14px, ${pColor} 15px),
                            -webkit-radial-gradient(100% 100%, circle, rgba(204,102,153,0) 14px, ${pColor} 15px),
                            -webkit-radial-gradient(100% 0, circle, rgba(204,102,153,0) 14px, ${pColor} 15px),
                            -webkit-radial-gradient(0 0, circle, rgba(204,102,153,0) 14px, ${pColor} 15px);
                }

                /* border line */
                .tix-inner:before {
                    z-index: 0;
                    content: "";
                    display: block;
                    width: 286px;
                    height: 186px;
                    position: absolute;
                    left: 8px;
                    top: 8px;

                    background:
                         -webkit-radial-gradient(0 100%, circle, rgba(255,255,255,0) 14px, white 15px),
                         -webkit-radial-gradient(100% 100%, circle, rgba(255,255,255,0) 14px, white 15px),
                         -webkit-radial-gradient(100% 0, circle, rgba(255,255,255,0) 14px, white 15px),
                         -webkit-radial-gradient(0 0, circle, rgba(255,255,255,0) 14px, white 15px);
                }

                .tix-2 .tix-inner:before {
                    background: transparent;
                }

                .tix-inner:after {
                    z-index: 0;
                    content: "";
                    display: block;
                    width: 282px;
                    height: 182px;
                    position: absolute;
                    left: 10px;
                    top: 10px;

                    background:
                         -webkit-radial-gradient(0 100%, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                         -webkit-radial-gradient(100% 100%, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                         -webkit-radial-gradient(100% 0, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px),
                         -webkit-radial-gradient(0 0, circle, rgba(204,102,153,0) 14px, ${mainColor} 15px);
                }

                .tix-2 .tix-inner:after {
                    display: none;
                }

                .tix, .tix-2,
                .tix:before, .tix-2:before,
                .tix:after, .tix-2:after,
                .tix-inner:before,
                .tix-inner:after {
                    background-position: bottom left, bottom right, top right, top left;
                    -webkit-background-size: 50% 50%;
                    background-size: 50% 50%;
                    background-repeat: no-repeat;
                    border: hidden !important;
                }

                .tix-inner span {
                    z-index: 10;
                    position: relative;
                    color: #fff;
                }

                .tix-inner .discount-title {
                    top: 15px;
                    left: 25px;
                }

                .tix-inner .discount-title .value {
                    top: -18px;
                }

                .tix-inner .instru-txt {
                    line-height: 18px;
                }
            `}
            </style>
        </Fragment>
    );
}
