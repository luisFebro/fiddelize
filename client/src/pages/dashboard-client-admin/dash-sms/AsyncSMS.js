import React, { Fragment, useState, useEffect } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
import { useStoreState } from 'easy-peasy';
import './_AsyncSMS.scss';
import { Load } from '../../../components/code-splitting/LoadableComp';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../redux/actions/snackbarActions';
import scrollIntoView from '../../../utils/document/scrollIntoView';
import { handleFocus } from '../../../utils/form/handleFocus';
import InstructionBtn from '../../../components/buttons/InstructionBtn';
import { getUniqueId } from '../../../hooks/api/useAPI';
import { setRun } from '../../../hooks/useRunComp';
//Components
import CreditsBalance from './credits-balance/CreditsBalance';
import RecipientOptions from './recipient-options/RecipientOptions';
import MessageField from './message/MessageField';
import SmsHistory from './history/SmsHistory';
import AutomaticSMS from './automatic-sms/AutomaticSMS';

const AsyncSMSSuggestions = Load({ loader: () => import('./message/AsyncSMSSuggestions' /* webpackChunkName: "sms-suggestions-comp-lazy" */)});
// End Components

const TitleSMS = <Title />
export default function AsyncSMS() {
    const [data, setData] = useState({
        showMessage: false,
        contactList: [],
        whichTab: "Lista de Clientes",
        suggestionMsg: "",
        currBalance: 0,
    });
    const dispatch = useStoreDispatch();

    const {
        showMessage,
        whichTab,
        contactList,
        suggestionMsg,
        currBalance } = data;

    const handleUpdateSession = () => {
        showSnackbar(dispatch, "Atualizando Histórico...")
        const uniqueId = getUniqueId();
        const runName = `UpdateSMSAll ${uniqueId}`;
        setRun(dispatch, runName);
    }

    const handleWhichTab = currTab => {
        setData({ ...data, whichTab: currTab });
    }

    const handleList = (list) => {
        setData({ ...data, contactList: list });
    }

    useEffect(() => {
        if(showMessage) handleFocus("messageField", { delay: 2000, duration: 1500 });
    }, [showMessage])

    const handleShowMessage = (close) => {
        if(!contactList.length) {
            if(close !== false) {
                showSnackbar(dispatch, "Selecione, pelo menos, um contato", "error");
                return;
            }
        }

        const needClose = close === false;
        setData({ ...data, contactList: needClose ? [] : contactList, showMessage: needClose ? false : true });
    }

    const handleSuggestionMsg = text => {
        const config = {
            mode: "center",
            duration: 1500,
            onDone: () => setData({ ...data, suggestionMsg: text }),
        }
        scrollIntoView("#messageField", config);
    }

    const handleBalance = balance => {
        setData({ ...data, currBalance: balance })
    }

    const showInstruBtn = () => (
        <section className="position-relative m-0 d-flex justify-content-end">
            <p className="m-0 text-normal font-weight-bold text-purple">
            Por que SMS ?  </p>
            <section className="align-self-end">
                <InstructionBtn
                    mode="modal"
                    article="WhySMS_art4"
                />
            </section>
        </section>
    );

    return (
        <Fragment>
            <div className="async-sms-title">
                <DashSectionTitle
                    title={TitleSMS}
                />
            </div>
            {showInstruBtn()}
            <CreditsBalance handleBalance={handleBalance} />
            <RecipientOptions
                whichTab={whichTab}
                setWhichTab={handleWhichTab}
                handleList={handleList}
                handleShowMessage={handleShowMessage}
            />
            <MessageField
                showMessage={showMessage}
                suggestionMsg={suggestionMsg}
                handleUpdateSession={handleUpdateSession}
                whichTab={whichTab}
                contactList={contactList}
                currBalance={currBalance}
                totalRecipients={contactList.length}
                handleShowMessage={handleShowMessage}
            />
            {showMessage && (
                <AsyncSMSSuggestions
                    handleSuggestionMsg={handleSuggestionMsg}
                    contactList={contactList}
                />
            )}
            <hr className="lazer-purple" />
            <AutomaticSMS />
            <hr className="lazer-purple" />
            <SmsHistory handleUpdateSession={handleUpdateSession} />
        </Fragment>
    );
}

function Title() {
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