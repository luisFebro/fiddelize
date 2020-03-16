import React, { Fragment } from 'react';
import Title from '../../components/Title';
import { useStoreState } from 'easy-peasy';
import GroupedDashSessions from './GroupedDashSessions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import Navbar from '../../components/_layout/navbar';
import isThisApp from '../../utils/window/isThisApp';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';
import ButtonFab from '../../components/buttons/material-ui/ButtonFab';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { name, clientAdmin, bizId, role } = useStoreState(state => ({
        name: state.userReducer.cases.currentUser.name,
        role: state.userReducer.cases.currentUser.role,
        bizId: state.userReducer.cases.currentUser._id,
        clientAdmin: state.userReducer.cases.currentUser.clientAdminData,
    }));

    const showGreetingAndActionBtns = () => (
        <div className="position-relative" style={{minHeight: '75px'}}>
            <section style={{zIndex: 3000, right: '20px', top: '55px' }} className="position-absolute container-center">
                <div style={{marginRight: '15px'}}>
                    <ButtonFab
                        backgroundColor="var(--themeSDark)"
                        position="relative"
                        size="medium"
                        iconFontAwesome={`fas fa-mobile-alt`}
                        iconFontSize="1.8em"
                        iconMarginLeft="0"
                        onClick={null}
                    />
                </div>
                <Link to={`/${clientAdmin.bizCodeName}/compartilhar-app?negocio=${clientAdmin.bizName}&id=${bizId}&role=${role}`}>
                    <ButtonMulti
                        title="compartilhar app"
                        onClick={null}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        backColorOnHover="var(--themeSDark)"
                        iconFontAwesome="fas fa-share-alt"
                    />
                </Link>
            </section>
            <p
                style={{margin: 0, paddingLeft: 20}}
                className="text-normal text-center text-white"
            >
                <span>{getDayGreetingBr()},
                <br />
                {name ? `${name.cap()}!` : " ..."}</span>
            </p>
        </div>
    );

    return (
        <Fragment>
            {isThisApp()
            ? (
                <Navbar />
            ) : null}
            {showGreetingAndActionBtns()}
            <br/>
            <GroupedDashSessions />
        </Fragment>
    );
}
