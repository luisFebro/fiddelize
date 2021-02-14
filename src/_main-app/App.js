import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga"; // google analytics
import isThisApp from "../utils/window/isThisApp";
import isWebpSupported from "../utils/media/isWebpSupported";
import deferJsOnload from "../utils/performance/deferJsOnload";
import useOffline from "../hooks/useOffline";
import { useRecoveryAndDataOffline } from "../hooks/roles-storage-and-data-recovery";
import { IS_PROD } from "../config/clientUrl";
import "../utils/globalHelpers";
// STYLING
import "./scss/App.scss";
// I inlined all critical bootstrap classes on critical css... OMG!!
// Selected is just the other ones...
import "./styles/bootstrap.selected.css";
import "./libraries/fontAwesomeLib";
// END STYLING
// import { loadReCaptcha } from 'react-recaptcha-google';
import AsyncWebsite from "./user-interfaces/AsyncWebsite";
import AsyncMobileApp from "./user-interfaces/AsyncMobileApp";
// END UIs
import useCustomerBirthdayToday from "../hooks/notification/useCustomerBirthdayToday";
// import ScrollToTop from 'react-router-scroll-top';

export default function App() {
    useRecoveryAndDataOffline();
    useOffline();
    useCustomerBirthdayToday();

    useEffect(() => {
        isWebpSupported(
            "lossy",
            (lossy, res) =>
                res && console.log(`This browser suppors webp image: ${res}`)
        );

        const runGoogleAnalytics = () => {
            const opts = { testMode: false };
            ReactGA.initialize(process.env.REACT_APP_GA_KEY, opts);
            ReactGA.pageview(window.location.pathname + window.location.search);
        };

        IS_PROD && deferJsOnload(runGoogleAnalytics, "func", { delay: 5000 });
        deferJsOnload(
            "https://cdn.jsdelivr.net/npm/pwacompat@2.0.10/pwacompat.min.js",
            "url",
            {
                integrity:
                    "sha384-I1iiXcTSM6j2xczpDckV+qhhbqiip6FyD6R5CpuqNaWXvyDUvXN5ZhIiyLQ7uuTh",
                crossorigin: "anonymous",
            }
        );
    }, []);

    return (
        <BrowserRouter>
            {isThisApp() ? <AsyncMobileApp /> : <AsyncWebsite />}
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
