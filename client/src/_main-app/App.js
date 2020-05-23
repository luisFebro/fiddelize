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
import Website from './user-interfaces/Website';
import MobileApp from './user-interfaces/MobileApp';
//END UIs
let run = true;
export default function App() {
    useRecoveryAndDataOffline();
    const dispatch = useStoreDispatch();

    useEffect(() => {
        // loadReCaptcha();
        if(run) {
            dispatch(loadUser(dispatch));

            // GA
            const opts = { testMode: true }
            ReactGA.initialize(process.env.REACT_APP_GA_KEY, opts);
            ReactGA.pageview(window.location.pathname + window.location.search);
            // END GA

            run = false;
        }
    }, [dispatch]);


    return (
        <BrowserRouter>
            <ScrollToTop>
                <div>
                    {isThisApp() ? <MobileApp /> : <Website />}
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
