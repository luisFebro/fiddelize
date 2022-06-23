import { useEffect, useState } from "react";
import getCountdownTimer from "utils/numbers/getCountdownTimer";
import Navbar from "../menu-nav/comps/Navbar";

var player;

export default function PopupAdContent({ setPopupOpen }) {
    const [currCount, setCurrCount] = useState(0);
    const [isOver, setIsOver] = useState(false);

    const skipCounterElem = document.querySelector(".skip-counter");

    useEffect(() => {
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement("script");

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        tag.async = true;
        tag.crossorigin = "anonymous";
        document.body.appendChild(tag);

        const iframeId = document.getElementById("adIframeVid");
        if (!window.YT || iframeId) return null;

        var width = iframeId.getAttribute("width");
        var height = iframeId.getAttribute("height");
        var src = iframeId.getAttribute("src");
        //splitting to get the videoId from src.
        var partsArr = src.split("/");
        var videoSource = partsArr[partsArr.length - 1].split("?");
        console.log("videoSource", videoSource);
        var videoId = videoSource[videoSource.length - 2];
        console.log("videoId", videoId);

        player = new YT.Player("vidWrapper", {
            height,
            width,
            videoId,
            events: {
                onStateChange: function (event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        startVideo();
                    }
                    if (event.data == YT.PlayerState.PAUSED) {
                        stopVideo();
                    }
                },
            },
        });

        // player.playVideo();
        // 4. The API will call this function when the video player is ready
        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
                setTimeout(stopVideo, 6000);
                done = true;
            }
        }
    }, []);

    const handleAccess = () => {
        if (player) player.playVideo();
        // setPopupOpen(false);
    };

    useEffect(() => {
        const handleOverAd = () => {
            setIsOver(true);
        };

        if (skipCounterElem)
            getCountdownTimer({
                dur: 0.5,
                elem: skipCounterElem,
                onlySecs: true,
                overCallback: handleOverAd,
            });
    }, [skipCounterElem]);

    // const SkipBtn = () => (

    // );

    return (
        <section>
            <Navbar title="Anúncio" />

            <div id="vidWrapper" className="iframe-area">
                <p>Para prosseguir, assista ao vídeo.</p>
                <iframe
                    id="adIframeVid"
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/SHoUJ6Ea6kw?enablejsapi=1"
                    title="YouTube video player"
                    frameborder="0"
                    autoPlay
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
                <style jsx>
                    {`
                        .iframe-area {
                            position: relative;
                            top: 60px;
                        }

                        .iframe-area > p {
                            color: white;
                            text-align: center;
                            font-size: 21px;
                            padding: 23px;
                        }
                    `}
                </style>
            </div>
            <section className="ad-access-area">
                {isOver ? (
                    <span id="copyIdBtn" className="ad-over-access">
                        <a
                            href="#"
                            className="ad-over-access-btn"
                            onClick={handleAccess}
                        >
                            FECHAR
                        </a>
                        <style jsx>
                            {`
                                .ad-over-access {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }

                                .ad-over-access-btn {
                                    cursor: pointer;
                                    position: relative;
                                    text-align: center;
                                    font-size: 15px;
                                    font-weight: 500;
                                    color: #fff;
                                    text-decoration: none !important;
                                    z-index: 100;
                                    overflow: hidden;
                                    padding: 8px 20px;
                                    text-shadow: 1px 1px 3px black;
                                    display: inline-block;
                                    border-radius: 100px;
                                    background: var(--btnColor);
                                }
                            `}
                        </style>
                    </span>
                ) : (
                    <div className="skip-text">
                        Acesso em <span className="num skip-counter">30</span>
                        <span className="num">segundos</span>
                        <style jsx>
                            {`
                                .skip-text {
                                    position: relative;
                                    top: 50px;
                                    color: #fff;
                                    text-align: center;
                                }

                                .skip-text .skip-counter {
                                    display: block;
                                    padding-right: 5px;
                                }

                                .skip-text .num {
                                    display: inline-block;
                                    color: var(--connected);
                                    font-size: 20px;
                                    font-family: var(--mainFont);
                                }
                            `}
                        </style>
                    </div>
                )}
                <button className="d-none" onClick={() => handleAccess()}>
                    click
                </button>
                <style jsx>
                    {`
                        .ad-access-area {
                            position: relative;
                            top: 60px;
                        }
                    `}
                </style>
            </section>
        </section>
    );
}
