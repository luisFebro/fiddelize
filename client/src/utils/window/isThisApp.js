import { IS_DEV } from '../../config/clientUrl';

// change here only if it is the website to be developed in localhost
const localHostWebsiteMode = false;
const localHostAppMode = IS_DEV ? true : false;

export default function isThisApp() {
    const isInWebAppiOS = window.navigator.userAgent.toLowerCase();
    // console.log("isInWebAppiOS", isInWebAppiOS) = mozilla/5.0 (windows nt 6.1) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.130 safari/537.36
    const resIos = /iphone|ipad|ipod/.test(isInWebAppiOS);

    const isAppFromFirefox = window.fullScreen;
    const isAppFromSafariOrChrome = window.navigator.standalone;
    const isAppFromChrome = (window.matchMedia('(display-mode: standalone)').matches);
    const isAndroidStockBrowser = checkIfStockBrowser() // samsung

    const checkBrowsers = resIos || isAppFromChrome || isAppFromFirefox || isAppFromSafariOrChrome || isAndroidStockBrowser;

    if(localHostWebsiteMode) return false;
    return localHostAppMode
    ? true
    : checkBrowsers
}

// https://stackoverflow.com/questions/53378576/detect-web-app-running-as-homescreen-app-on-android-stock-browser
function checkIfStockBrowser() {
    if (!(window.sessionStorage || false)) return false; // Session storage not supported
    if (window.location.href.indexOf('?is_pwa=1') >= 0) {
        window.sessionStorage.setItem('isPWA', '1');
    }

    return window.sessionStorage.getItem('isPWA') == '1';
}

/*
Idea to dynamically generate manifest for pick customized logo:
/ This approach has many caveats. Be aware of all of them before using this solution
import manifestBase from '../manifest.json';

const myToken = window.localStorage.getItem('myToken');
const manifest = { ...manifestBase };
manifest.start_url = `${window.location.origin}?standalone=true&myToken=${myToken}`;
const stringManifest = JSON.stringify(manifest);
const blob = new Blob([stringManifest], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);
document.querySelector('meta[rel=manifest]').setAttribute('href', manifestURL);

https://stackoverflow.com/questions/53378576/detect-web-app-running-as-homescreen-app-on-android-stock-browser
 */

/*
another alternative solution:
navigator.standalone = navigator.standalone || (screen.height-document.documentElement.clientHeight<40)
https://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile
 */

