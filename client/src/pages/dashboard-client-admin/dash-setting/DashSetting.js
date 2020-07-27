import React, { Fragment } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
import { useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './DashSetting.scss';
import ShowConfigExpansiblePanel from './expansible-panel/ShowExpansiblePanel';
import BottomActionBtns from './BottomActionBtns';

// IMPLEMENT SOME CODE SPLITTING TO THE SETTING COMPONENTS
export default function DashSetting() {
    return (
        <Fragment>
            <div style={{marginTop: '16px', display: "block"}}>
                <DashSectionTitle
                    title={<Title />}
                />
            </div>
            <main className="mt-2">
                <ShowConfigExpansiblePanel />
            </main>
            <BottomActionBtns />
        </Fragment>
    );
}

const Title = () => {
    const bizName = useStoreState(state => state.userReducer.cases.clientAdmin.bizName)

    return(
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Configurações da
                <br />
                <span className="text-title">{bizName && bizName.cap()}</span>
            </span>
        </Fragment>
    );
};
