const localHostAppMode = true;

export default function isThisApp() {
    const isInWebAppiOS = window.navigator.userAgent.toLowerCase();
    // console.log("isInWebAppiOS", isInWebAppiOS) = mozilla/5.0 (windows nt 6.1) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.130 safari/537.36
    const resIos = /iphone|ipad|ipod/.test(isInWebAppiOS);

    const isAppFromFirefox = window.fullScreen;
    const isAppFromSafari = window.navigator.standAlone;
    const isAppFromChrome = (window.matchMedia('(display-mode: standalone)').matches);

    const checkBrowsers = resIos || isAppFromChrome || isAppFromFirefox || isAppFromSafari;
    return localHostAppMode
    ? true
    : checkBrowsers
}

