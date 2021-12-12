import { useState, useEffect, Fragment } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import SelectField from "components/fields/SelectField";
import getId from "utils/getId";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getAPI, { startSupport } from "api";
import getItems, { setItems } from "init/lStorage";
import showToast from "components/toasts";
import { useInitSocket } from "components/chat/socket/initSocket";
import { Load } from "components/code-splitting/LoadableComp";
import getSubjectBr from "components/chat/helpers";
import Field from "components/fields";
// import useSupportWaveColor from "./useSupportWaveColor";

const [loggedRole] = getItems("currUser", ["role"]);
// disable chatPreventMainPanel right closing an attendance so that customers can request a new attendence request
const [chatPreventMainPanel, chatHistoryOn] = getItems("global", [
    "chatPreventMainPanel",
    "chatHistoryOn",
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
    const { success, chatUserName, subject, selected } = data;
    const { firstName, name = null, role = "visitante", userId } = useData();

    useEffect(() => {
        if (firstName)
            setData((prev) => ({ ...prev, chatUserName: firstName }));
    }, [firstName]);

    // useSupportWaveColor({ trigger: !success });
    useScrollUp();
    useBackColor("var(--themeP)");

    const { socket, chatUserId, chatRoomId, blockNewSupport } = useInitSocket({
        namespace: "nspSupport",
        userId,
        role,
    });

    const goChatPanel = () => setData((prev) => ({ ...prev, success: true }));

    const startNewSupport = async () => {
        // allowNewSupport and chatPreventMainPanel prevents possible duplicates with some reloading here
        const someInfoInvalid =
            blockNewSupport ||
            chatPreventMainPanel ||
            !selected ||
            !chatUserId ||
            !chatRoomId;

        if (someInfoInvalid)
            return showToast("No momento o suporte não está disponível");

        const body = {
            roomId: chatRoomId,
            chatType: "support",
            dataType: {
                subject,
                subjectOtherLang: getSubjectBr(subject), // to be searchable in query
            },
            fromData: {
                userId: chatUserId, // admin dev nucleo-equipe id
                role: role || "visitante",
                userName: name || `Visitante ${getId(5)}`, // first name and surname
            },
        };

        await getAPI({
            method: "post",
            url: startSupport(),
            body,
        });

        setItems("global", { chatUserName });

        showToast("Iniciando sua sessão de suporte...", { type: "success" });
        setTimeout(() => goChatPanel(), 1500);
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
            if (firstName) {
                return (
                    <p className="m-0 font-site text-em-1-4">{firstName},</p>
                );
            }

            return (
                <section className="container-center">
                    <p className="font-site text-em-0-8 text-white text-left mb-2">
                        Informe seu nome:
                    </p>
                    <Field
                        textAlign="text-center"
                        size="medium"
                        name="chatUserName"
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
                                backgroundColor="var(--themeSDark)"
                                onClick={() => {
                                    if (!chatUserName)
                                        return showToast(
                                            "Informe seu nome e uma categoria de assunto"
                                        );
                                    if (!selected)
                                        return showToast(
                                            `${firstName}, favor selecione um assunto`
                                        );
                                    return startNewSupport();
                                }}
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
                <AsyncChat
                    chatUserId={chatUserId}
                    subject={subject}
                    socket={socket}
                    role={role}
                />
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
