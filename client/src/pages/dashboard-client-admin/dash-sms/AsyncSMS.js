import React, { Fragment } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
import { useStoreState } from 'easy-peasy';

//Components
import RecipientOptions from './recipient-options/RecipientOptions';
// End Components

export default function AsyncSMS() {
    const TitleSMS = <Title />

    return (
        <Fragment>
            <div style={{marginTop: '16px', display: "block"}}>
                <DashSectionTitle
                    title={TitleSMS}
                />
            </div>
            <section>
                <RecipientOptions />
            </section>
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