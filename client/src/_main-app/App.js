import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import isThisApp from '../utils/window/isThisApp';
import setDataIfOnline from '../utils/storage/setDataIfOnline';
import { clientAdminColl, userProfileColl } from '../utils/storage/lStorage';
import { useProfile, useClientAdmin, useClientUser } from '../hooks/useRoleData';
import useRecoverSysData from '../hooks/useRecoverSysData';
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

    // local storage and system

    const { userId, role, userName } = useProfile();
    const { bizId, userScore, userLastScore, userPurchase } = useClientUser(); // , userPurchase
    const { bizName, bizPlan, bizCodeName, bizRegulation, maxScore, mainReward } = useClientAdmin();

    setDataIfOnline(userProfileColl, { _id: userId, role, name: userName, currScore: userScore, lastScore: userLastScore, purchase: userPurchase });
    setDataIfOnline(clientAdminColl, { bizName, bizPlan, bizCodeName, regulation: { text: bizRegulation.text, updatedAt: bizRegulation.updatedAt }, maxScore, mainReward });
    useRecoverSysData(role, userId, { bizId: bizId });
    // end local storage and system
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
