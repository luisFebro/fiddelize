import { useState, useEffect, Fragment } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import SelectField from "components/fields/SelectField";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getAPI, { startSupport } from "api";
import getItems from "init/lStorage";
import showToast from "components/toasts";
import {
    useInitSocket,
    startSocketSession,
} from "components/chat/socket/initSocket";
import { Load } from "components/code-splitting/LoadableComp";
import getSubjectBr from "components/chat/helpers";
import getId from "utils/getId";
import Field from "components/fields";
import getFirstName from "utils/string/getFirstName";
// import useSupportWaveColor from "./useSupportWaveColor";

const [loggedRole] = getItems("currUser", ["role"]);
// disable chatPreventMainPanel right closing an attendance so that customers can request a new attendence request
const [
    chatPreventMainPanel,
    chatHistoryOn,
    storedUserName,
    chatUserId,
] = getItems("global", [
    "chatPreventMainPanel",
    "chatHistoryOn",
    "chatUserName",
    "chatUserId",
]);
const isFiddelizeTeam = loggedRole === "nucleo-equipe";

export const AsyncChat = Load({
    loader: () =>
        import(
            "components/chat/Chat" /* webpackChunkName: "history-chat-lazy" */
        ),
});

export default function Support() {
    const [data, setData] = useState({
        subject: null,
        selected: false,
        success: isFiddelizeTeam || chatPreventMainPanel,
        chatUserName: null,
    });
    const [disabled, setDisabled] = useState(false);

    const { success, chatUserName, subject, selected } = data;
    const { name = null, role = "visitante", userId } = useData();

    // useSupportWaveColor({ trigger: !success });
    useScrollUp();
    useBackColor("var(--themeP)");

    const socket = useInitSocket({
        namespace: "nspSupport",
        role,
        userId,
        name,
    });

    useEffect(() => {
        if (name) setData((prev) => ({ ...prev, chatUserName: name }));
    }, [name]);

    const goChatPanel = () => setData((prev) => ({ ...prev, success: true }));

    const startNewSupport = async () => {
        if (!chatUserName && !storedUserName)
            return showToast("Informe seu nome e uma categoria de assunto");

        if (!selected) return showToast("Favor selecione um assunto");
        setDisabled(true);

        // if user is loggedIn, use his/her userId instead. Or secondly, if it is the second time a visitor is entering, use his/her prior id to get his/her history
        const newChatRoomId = `room${getId()}`;
        const newChatUserId = userId || chatUserId || `user${getId()}`;
        const newChatUserName = chatUserName || storedUserName;

        // save locally and socket
        const chatRoom = {
            chatRoomId: newChatRoomId, // only requires this, but chatUserId is used to keep consistency especially in requests
            chatUserId: newChatUserId,
            chatUserName: newChatUserName,
            chatRole: role,
        };

        startSocketSession(socket, chatRoom);

        const body = {
            roomId: newChatRoomId,
            chatType: "support",
            dataType: {
                subject,
                subjectOtherLang: getSubjectBr(subject), // to be searchable in query
            },
            fromData: {
                userId: newChatUserId,
                role: role || "visitante",
                userName: newChatUserName, // first name and surname
            },
        };

        await getAPI({
            method: "post",
            url: startSupport(),
            body,
        });

        showToast("Iniciando sua sessão de suporte...", { type: "success" });

        setTimeout(() => {
            socket.emit("updateBizRooms");
            goChatPanel();
        }, 1500);

        return "started";
    };

    const showSubjectSelectField = () => {
        const defaultVal = "Selecione assunto:";
        // LESSON: keep all data in English language, then create a file for translation and use throught the project like getOtherLang(br)

        const valuesArray = [
            { val: "question", showVal: "Dúvida" },
            { val: "suggestion", showVal: "Sugestão" },
            { val: "usageHelp", showVal: "Ajuda de uso" },
            { val: "bugReport", showVal: "Relatar falha" },
            { val: "others", showVal: "Outros" },
        ];

        const handleSelectValue = (val) => {
            if (!val || val === defaultVal) return;

            const { val: subjectSelected } = valuesArray.find(
                (elem) => elem.val === val
            );
            setData((prev) => ({
                ...prev,
                subject: subjectSelected,
                selected: true,
            }));
        };

        const userNameSelection = () => {
            if (getFirstName(storedUserName || name)) {
                return (
                    <p className="m-0 font-site text-em-1-4">
                        {getFirstName(storedUserName || name)},
                    </p>
                );
            }

            return (
                <section className="container-center-col">
                    <p className="font-site text-em-0-8 text-white text-left mb-2">
                        Informe seu nome:
                    </p>
                    <Field
                        textAlign="text-center"
                        size="medium"
                        name="chatUserName"
                        maxLength="30"
                        value={chatUserName}
                        onChangeCallback={setData}
                        zIndex={1}
                    />
                </section>
            );
        };

        return (
            <div className="col-md-6">
                <div className="container-center-col">
                    {userNameSelection()}
                    <SelectField
                        title={defaultVal}
                        valuesArray={valuesArray}
                        handleValue={handleSelectValue}
                    />
                    <div className="container-center">
                        <ButtonFab
                            title="Ver histórico"
                            backgroundColor="var(--themeSDark)"
                            onClick={() => {
                                if (!chatHistoryOn)
                                    return showToast(
                                        "Você não tem histórico de atendimento. Selecione um assunto para iniciar."
                                    );
                                return goChatPanel();
                            }}
                            titleSize="small"
                            position="relative"
                            variant="extended"
                            size="small"
                        />
                        <div className="ml-3">
                            <ButtonFab
                                title="Continuar"
                                disabled={disabled}
                                backgroundColor="var(--themeSDark)"
                                onClick={startNewSupport}
                                position="relative"
                                variant="extended"
                                size="medium"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const showMain = () => (
        <section className="text-normal text-white">
            <h1 className="mt-2 mb-5">
                <img
                    className="img-center"
                    src="/img/logo.png"
                    alt="fiddelize logo"
                    height="auto"
                    width="100px"
                />
                <p className="mt-3 text-shadow text-white text-subtitle font-weight-bold text-center">
                    Suporte Fiddelize
                </p>
            </h1>
            <section className="mb-md-5 middle-area d-flex flex-column flex-md-row mx-3">
                <p className="col-md-6 text-shadow">
                    Tem alguma dúvida, uma sugestão, ou precisa de ajuda com o
                    seu app? Estamos aqui para te ajudar!
                </p>
                {showSubjectSelectField()}
            </section>
            <div
                className="d-block d-md-none position-relative"
                style={{
                    width: "100%",
                }}
            >
                <img
                    width="100%"
                    height="auto"
                    style={{ overflow: "hidden" }}
                    src="/img/shapes/wave2.svg"
                    alt="onda"
                />
            </div>
        </section>
    );

    return (
        <Fragment>
            {success ? (
                <AsyncChat role={role} subject={subject} socket={socket} />
            ) : (
                showMain()
            )}
        </Fragment>
    );
}

// ARCHIVES
// function useHandleUniqueIds() {
//     const uify = useAction();

//     updateUI("global", {
//         chatUserId: getPersistentData({
//             name: "chatUserId",
//             val: getId(),
//         }),
//         chatRoomId: getPersistentData({
//             name: "chatRoomId",
//             val: getId(),
//         }),
//     }, uify)
// }
