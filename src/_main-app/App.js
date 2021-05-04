import { useEffect } from "react";
import { GlobalProvider } from "context";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga"; // google analytics
import isThisApp from "utils/window/isThisApp";
// import isWebpSupported from "../utils/media/isWebpSupported";
import deferJsOnload from "utils/performance/deferJsOnload";
import useOffline from "hooks/useOffline";
import { IS_PROD } from "config/clientUrl";
import switchConsoleLogs from "utils/security/switchConsoleLogs";
import showToast from "components/toasts";
import checkValidSession from "auth/checkValidSession";
import useGlobalApp from "./useGlobalApp.js";
import "utils/globalHelpers";
// STYLING
import "./scss/App.scss";
// I inlined all critical bootstrap classes on critical css... OMG!!
// Selected is just the other ones...
import "./styles/bootstrap.selected.css";
import "./libraries/fontAwesomeLib";
// END STYLING
import AsyncWebsite from "./user-interfaces/AsyncWebsite";
import AsyncMobileApp from "./user-interfaces/AsyncMobileApp";
// END UIs
// import ScrollToTop from 'react-router-scroll-top';
// import useData from "init";
const isApp = isThisApp();

export default function App() {
    useOffline();

    useEffect(() => {
        switchConsoleLogs();
        checkValidSession();

        const runGoogleAnalytics = () => {
            const opts = { testMode: false };
            ReactGA.initialize(process.env.REACT_APP_GA_KEY, opts);
            ReactGA.pageview(window.location.pathname + window.location.search);
        };

        if (IS_PROD) deferJsOnload(runGoogleAnalytics, "func", { delay: 5000 });

        deferJsOnload(
            "https://cdn.jsdelivr.net/npm/pwacompat@2.0.10/pwacompat.min.js",
            "url",
            {
                integrity:
                    "sha384-I1iiXcTSM6j2xczpDckV+qhhbqiip6FyD6R5CpuqNaWXvyDUvXN5ZhIiyLQ7uuTh",
                crossorigin: "anonymous",
            }
        );

        window.addEventListener("DOMContentLoaded", () => {
            // The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
            navigator.serviceWorker.addEventListener("message", (event) => {
                // show toast for in-app notification
                const { title, body } = event.data;

                showToast(`🔔) ${title}: ${body}`, {
                    fix: true,
                    needActionBtn: true,
                    actionBtnText: "ver",
                    onClick: () => window.location.reload(),
                });
            });
        });
    }, []);

    const store = useGlobalApp();

    return (
        <BrowserRouter>
            <GlobalProvider store={store}>
                {isApp ? <AsyncMobileApp /> : <AsyncWebsite />}
            </GlobalProvider>
        </BrowserRouter>
    );
}

/* ARCHIVES
// const callback = list => {
//     list.getEntries().forEach(entry => {
//       ReactGA.timing({
//         category: "Load Performance",
//         variable: 'Server Latency',
//         value: entry.responseStart - entry.requestStart
//       })
//   })
// }

// var observer = new PerformanceObserver(callback);// metrics
// observer.observe({entryTypes: ['navigation'] })

import WhatsappIcon from '../components/buttons/WhatsappIcon';
<WhatsappIcon />

<CustomPreloader>
    <Preloader />
</CustomPreloader>
 */

/* COMMENTS
n1:
Server latency:
entry.responseStart - entry.requestStart

Download time:
entry.responseEnd - entry.responseStart

Total app load time:
entry.responseEnd - entry.requestStart

https://www.freecodecamp.org/news/performance-and-user-tracking-in-react-with-google-analytics/
*/

/* ARCHIVES

// https://web.dev/nfc/ - Web NFC is available on Android in Chrome 89.
if ("NDEFReader" in window) {
    console.log("Scan and write NFC tags");
}

// To experiment with the Notification Triggers API locally, without an origin trial token, enable the #enable-experimental-web-platform-features flag in chrome://flags
if ("showTrigger" in Notification.prototype) {
    console.log("Notification Triggers supported");
}

isWebpSupported(
    "lossy",
    (lossy, res) =>
        res && console.log(`This browser suppors webp image: ${res}`)
);

 */
