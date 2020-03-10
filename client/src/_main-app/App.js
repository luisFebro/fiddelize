import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import isThisApp from '../utils/window/isThisApp';
// REDUX
import { useStoreDispatch } from 'easy-peasy';
import { loadUser } from '../redux/actions/authActions';
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

export default function App() {
    const dispatch = useStoreDispatch();

    useEffect(() => {
        // loadReCaptcha();
        dispatch(loadUser(dispatch));
    }, [dispatch]);

    return (
        <BrowserRouter>
            <ScrollToTop>
                <div primary-theme="default">
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
