import React, { Fragment } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
import { useStoreState } from 'easy-peasy';
import './_AsyncSMS.scss';

//Components
import CreditsBalance from './credits-balance/CreditsBalance';
import RecipientOptions from './recipient-options/RecipientOptions';
// End Components

export default function AsyncSMS() {
    const TitleSMS = <Title />

    return (
        <Fragment>
            <div className="async-sms-title">
                <DashSectionTitle
                    title={TitleSMS}
                />
            </div>
            <CreditsBalance />
            <RecipientOptions />
            <hr className="lazer-purple" />
        </Fragment>
    );
}

const Title = () => {
    const bizName = useStoreState(state => state.userReducer.cases.clientAdmin.bizName)

    return(
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Envio SMS da
                <br />
                <span className="text-title">{bizName && bizName.cap()}</span>
            </span>
        </Fragment>
    );
};