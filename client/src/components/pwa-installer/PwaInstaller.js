import './style.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import isThisApp from '../../utils/window/isThisApp';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import parse from 'html-react-parser';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';
import lStorage from '../../utils/storage/lStorage';
import useAnimateElem from '../../hooks/scroll/useAnimateElem';

PwaInstaller.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  run: PropTypes.bool,
  setIsInstalled: PropTypes.func,
}

function closeWindow() {
    window.close();
    return false; // only desktop // preventing the browser to attempt to go to that URL (which it obviously isn't).
}


let deferredPrompt = null;
export default function PwaInstaller({ title, icon, run = true, setDownloadAvailable }) { // A2HS = App to HomeScreen
    const [bannerVisible, setBannerVisible] = useState(false);
    useAnimateElem(".pwa-installer--text", {animaIn: "fadeInUp", speed: "slow" })


    const shouldRender = run && bannerVisible && !isThisApp();

    useEffect(() => {
        if(bannerVisible) { setDownloadAvailable(true); }
    }, [bannerVisible])

    const dispatch = useStoreDispatch();

    useEffect(() => {
        // This event requires the page to reload in order to set correctly...
        window.addEventListener('beforeinstallprompt', (e) => { // n1
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            setBannerVisible(true);
        })
    }, [])

    const handlePwaInstall = () => {
        if(deferredPrompt) {
            // Show the prompt
            setBannerVisible(false);
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompts
            deferredPrompt.userChoice.then(function(choiceResult) {
                if(choiceResult.outcome === 'accepted') {
                    showSnackbar(dispatch, 'Instalando seu App agora...', 'warning', 11000)
                    setTimeout(() => {
                        showSnackbar(dispatch, 'Instalado com sucesso! Você pode fechar essa janela e acessar o app na sua tela inicial', 'success', 8000)
                        setTimeout(() => closeWindow(), 7000)
                        const timeoutDuration = 15000;
                        setTimeout(() => window.location.href = "/acesso/verificacao", timeoutDuration)
                    }, 10990)
                } else {
                    showSnackbar(dispatch, 'A instalação do app foi cancelada.', 'warning')
                }
                deferredPrompt = null;
            });
        }
    }


    const styles = {
        icon: {
            animationDelay: '3s',
        },
        closeBtn: {
            animationDelay: '5s',
            animationIterationCount: 2,
            zIndex: 2100,
        },
    }

    // RENDER
    const showTitle = () => (
        <div
            className="add-to-home-text text-normal"
        >
            <a
                className="text-white"
            >
              { parse(title) || 'Add to Home Screen'}
            </a>
        </div>
    );

    const handleCloseBannerBtnClick = () => setBannerVisible(false);

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

    return (
        <div>
            {shouldRender
            ? (
                <div
                  className="pwa-installer--text add-to-home-banner"
                >
                    <div
                        onClick={handlePwaInstall}
                        className="add-to-home-content"
                    >
                        {icon ? <img style={styles.icon} className="add-to-home-icon animated slideInLeft" src={icon} /> : null}
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