import { useState, useEffect } from "react";
import { handleFocus } from "../../../../../utils/form/handleFocus";
import showToast from "../../../../../components/toasts";
import RecipientOptions from "./recipient-options/RecipientOptions";
import MessageField from "./send-notification/MessageField";
// import { Load } from "../../../../../components/code-splitting/LoadableComp";

// const AsyncMessageField = Load({
//     loader: () =>
//         import(
//              /* webpackChunkName: "sms-suggestions-comp-lazy" */
//         ),
// });

export default function NotifyUsersContent() {
    const [data, setData] = useState({
        usersList: [],
        appType: "", // actually the role
        whichTab: "Lista de Usuários",
        showMessage: false,
    });
    const { whichTab, appType, usersList, showMessage } = data;

    const handleAppType = (role) => {
        setData({
            ...data,
            appType: role,
        });
    };

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Notificar Usuários
            </p>
        </div>
    );

    useEffect(() => {
        if (showMessage)
            handleFocus("messageField", { delay: 2000, duration: 1500 });
    }, [showMessage]);

    const handleShowMessage = (close) => {
        if (!usersList.length) {
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
            usersList: needClose ? [] : usersList,
            showMessage: !needClose,
        });
    };

    const handleList = (list) => {
        setData({ ...data, usersList: list });
    };

    const handleWhichTab = (currTab) => {
        setData({ ...data, whichTab: currTab });
    };

    return (
        <section>
            {showTitle()}
            <RecipientOptions
                showMessage={showMessage}
                handleList={handleList}
                setWhichTab={handleWhichTab}
                handleShowMessage={handleShowMessage}
                handleAppType={handleAppType}
            />
            <MessageField
                showMessage={showMessage}
                setMainData={setData}
                whichTab={whichTab}
                usersList={usersList}
                appType={appType}
            />
        </section>
    );
}
