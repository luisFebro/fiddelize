import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import isThisApp from '../utils/window/isThisApp';
// REDUX
import { useStoreDispatch } from 'easy-peasy';
import { loadUser } from '../redux/actions/authActions';
import { useRecoveryAndDataOffline } from '../hooks/roles-storage-and-data-recovery';
import ReactGA from 'react-ga'; // google analytics
import '../utils/globalHelpers';
//STYLING
import './scss/App.scss';
import 'aos/dist/aos.css'; // take a look in these libraries to reduce bundle and improve performance.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import './libraries/fontAwesomeLib';
//END STYLING
// import { loadReCaptcha } from 'react-recaptcha-google';

// UIs
import AsyncWebsite from './user-interfaces/AsyncWebsite';
import AsyncMobileApp from './user-interfaces/AsyncMobileApp';
//END UIs
let run = true;
export default function App() {
    useRecoveryAndDataOffline();
    const dispatch = useStoreDispatch();

    // GA
    if(run) {
        const opts = { testMode: false }
        ReactGA.initialize(process.env.REACT_APP_GA_KEY, opts);
        ReactGA.pageview(window.location.pathname + window.location.search);

        const callback = list => {
            list.getEntries().forEach(entry => {
              ReactGA.timing({
                category: "Load Performance",
                variable: 'Server Latency',
                value: entry.responseStart - entry.requestStart
              })
          })
        }

        var observer = new PerformanceObserver(callback);// metrics
        observer.observe({entryTypes: ['navigation'] })
        run = false;
    }
    // END GA

    useEffect(() => {
        // loadReCaptcha();
        dispatch(loadUser(dispatch));
    }, [dispatch]);


    return (
        <BrowserRouter>
            <ScrollToTop>
                <div>
                    {isThisApp() ? <AsyncMobileApp /> : <AsyncWebsite />}
                </div>
            </ScrollToTop>
        </BrowserRouter>
    );
}

/* ARCHIVES
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
