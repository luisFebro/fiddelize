import { Fragment, useState, useEffect } from "react";
import { useBizData } from "init";
import DashSectionTitle from "../../DashSectionTitle";
import "./_AsyncSMS.scss";
import { Load } from "../../../components/code-splitting/LoadableComp";

import showToast from "../../../components/toasts";
import scrollIntoView from "../../../utils/document/scrollIntoView";
import { handleFocus } from "../../../utils/form/handleFocus";
import InstructionBtn from "../../../components/buttons/InstructionBtn";
import { getUniqueId } from "api/useAPI";
import { setRun, useAction } from "global-data/ui";
// Components
import CreditsBalance from "./credits-balance/CreditsBalance";
import RecipientOptions from "./recipient-options/RecipientOptions";
import MessageField from "./message/MessageField";
import SmsHistory from "./history/SmsHistory";

const AsyncSMSSuggestions = Load({
    loader: () =>
        import(
            "./message/AsyncSMSSuggestions" /* webpackChunkName: "sms-suggestions-comp-lazy" */
        ),
});
// End Components

const TitleSMS = <Title />;
export default function AsyncSMS() {
    const [data, setData] = useState({
        showMessage: false,
        contactList: [],
        whichTab: "Lista de Clientes",
        suggestionMsg: "",
        currBalance: 0,
    });
    const uify = useAction();

    const {
        showMessage,
        whichTab,
        contactList,
        suggestionMsg,
        currBalance,
    } = data;

    const handleUpdateSession = () => {
        showToast("Atualizando Histórico...");
        const uniqueId = getUniqueId();
        const runName = `UpdateSMSAll ${uniqueId}`;
        setRun("runName", runName, uify);
    };

    const handleWhichTab = (currTab) => {
        setData({ ...data, whichTab: currTab });
    };

    const handleList = (list) => {
        setData({ ...data, contactList: list });
    };

    useEffect(() => {
        if (showMessage)
            handleFocus("messageField", { delay: 2000, duration: 1500 });
    }, [showMessage]);

    const handleShowMessage = (close) => {
        if (!contactList.length) {
            if (close !== false) {
                showToast("Selecione, pelo menos, um contato", {
                    type: "error",
                });
                return;
            }
        }

        const needClose = close === false;
        setData({
            ...data,
            contactList: needClose ? [] : contactList,
            showMessage: !needClose,
        });
    };

    const handleSuggestionMsg = (text) => {
        const config = {
            mode: "center",
            duration: 1500,
            onDone: () => setData({ ...data, suggestionMsg: text }),
        };
        scrollIntoView("#messageField", config);
    };

    const handleBalance = (balance) => {
        setData({ ...data, currBalance: balance });
    };

    const showInstruBtn = () => (
        <section className="position-relative m-0 d-flex justify-content-end">
            <p className="m-0 text-normal font-weight-bold text-purple">
                Por que SMS ?{" "}
            </p>
            <section className="align-self-end ml-2">
                <InstructionBtn mode="modal" article="WhySMS_art4" />
            </section>
        </section>
    );

    return (
        <Fragment>
            <div className="async-sms-title">
                <DashSectionTitle title={TitleSMS} />
            </div>
            {showInstruBtn()}
            <CreditsBalance handleBalance={handleBalance} />
            <RecipientOptions
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
            <SmsHistory handleUpdateSession={handleUpdateSession} />
        </Fragment>
    );
}

function Title() {
    const { bizName } = useBizData();

    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Envio SMS da
                <br />
                <span className="text-title">{bizName && bizName.cap()}</span>
            </span>
        </Fragment>
    );
}
