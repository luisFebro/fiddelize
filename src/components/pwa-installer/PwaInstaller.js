import "./style.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import isThisApp from "utils/window/isThisApp";
import useAnimateElem from "hooks/scroll/useAnimateElem";
import showToast from "components/toasts";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";

const isApp = isThisApp();

PwaInstaller.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    run: PropTypes.bool,
    setIsInstalled: PropTypes.func,
};

function closeWindow() {
    window.close();
    return false; // only desktop // preventing the browser to attempt to go to that URL (which it obviously isn't).
}

const getStyles = () => ({
    closeBtn: {
        animationDelay: "5s",
        animationIterationCount: 2,
        zIndex: 2100,
    },
});

let deferredPrompt = null;
const displayBannerOnDev = false;
export default function PwaInstaller({
    title,
    icon,
    run = true,
    setData,
    alwaysOn = false,
    isBizTeam,
}) {
    // A2HS = App to HomeScreen
    const [bannerVisible, setBannerVisible] = useState(false);
    useAnimateElem(".pwa-installer--text", {
        animaIn: "fadeInUp",
        speed: "slow",
    });

    const styles = getStyles();

    const shouldRender =
        displayBannerOnDev || alwaysOn || (run && bannerVisible && !isApp);

    useEffect(() => {
        if (bannerVisible && setData) {
            setData((prev) => ({
                ...prev,
                downloadAvailable: true,
            }));
        }

        if (alwaysOn) setBannerVisible(true);
    }, [bannerVisible, alwaysOn]);

    useEffect(() => {
        // This event requires the page to reload in order to set correctly...
        window.addEventListener("beforeinstallprompt", (e) => {
            // n1
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            setBannerVisible(true);

            if (setData)
                setData((prev) => ({
                    ...prev,
                    beforeinstallprompt: `e:${JSON.stringify(e)}`,
                }));
        });
    }, []);

    const handlePwaInstall = async () => {
        showToast("Iniciando...", { dur: 2500 });

        if (deferredPrompt) {
            // Show the prompt and config
            await Promise.all([
                setBannerVisible(false),
                deferredPrompt.prompt(),
            ]);
            // Wait for the user to respond to the prompts
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    showToast("Instalando seu App agora...", { dur: 11000 });
                    setTimeout(() => {
                        showToast(
                            "Instalado com sucesso! Você pode fechar essa janela e acessar o app na sua tela inicial",
                            { type: "success", dur: 8000 }
                        );
                        setTimeout(() => closeWindow(), 7000);
                    }, 10990);
                } else {
                    showToast("A instalação do app foi cancelada.");
                }
                deferredPrompt = null;
            });
        }
    };

    // RENDER
    const showTitle = () => (
        <div className="add-to-home-text text-normal">
            <a className="text-white">{parse(title) || "Add to Home Screen"}</a>
        </div>
    );

    const handleCloseBannerBtnClick = () => {
        setBannerVisible(false);
    };

    const showActionBtn = () => (
        <div
            style={styles.closeBtn}
            className="add-to-home-close-btn animated wobble"
            // onClick={handleCloseBannerBtnClick}
        >
            <ButtonMulti
                title="baixar"
                onClick={handlePwaInstall}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
            />
        </div>
    );

    const isIconSquare = !isBizTeam && icon && icon.includes("h_100,w_100");
    return (
        <div>
            {shouldRender ? (
                <div className="pwa-installer--text add-to-home-banner">
                    <div
                        onClick={handlePwaInstall}
                        className="add-to-home-content"
                    >
                        {icon ? (
                            <span>
                                <img
                                    className="add-to-home-icon delay-3s animated slideInLeft"
                                    src={icon}
                                />
                                <style jsx>
                                    {`
                                        .add-to-home-icon {
                                            width: ${isIconSquare
                                                ? "60px"
                                                : "80px"};
                                            height: ${isIconSquare
                                                ? "65px"
                                                : "70px"};
                                            padding: 10px;
                                            padding-right: 0;
                                        }
                                    `}
                                </style>
                            </span>
                        ) : null}
                        {showTitle()}
                    </div>
                    {showActionBtn()}
                </div>
            ) : null}
        </div>
    );
}

/* COMMENTS
n1: If the user selects Install, the app is installed (available as standalone desktop app), and the Install button no longer shows (the onbeforeinstallprompt event no longer fires if the app is already installed).
*/

/* ARCHIVE TESTS
//https://web.dev/get-installed-related-apps/
//check if browser version supports the api
if ("getInstalledRelatedApps" in window.navigator) {
    (async () => {
        const relatedApps = await navigator.getInstalledRelatedApps();
        relatedApps.forEach((app) => {
            //if your PWA exists in the array it is installed
            setData((prev) => ({
                ...prev,
                relatedInstalledApps: "app" + app,
            }));
        });
    })();
}

// TEST
useEffect(() => {
    window.addEventListener("appinstalled", (evt) => {
        setData((prev) => ({
            ...prev,
            appinstalled: "app already installed" + JSON.stringify(evt),
        }));
        setBannerVisible(false);
    });
}, []);
*/
