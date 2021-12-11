import { useState, useEffect, Fragment } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import SelectField from "components/fields/SelectField";
import getId from "utils/getId";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getAPI, { startSupport } from "api";
import getItems from "init/lStorage";
import showToast from "components/toasts";
import { useInitSocket } from "components/chat/socket/initSocket";
import { Load } from "components/code-splitting/LoadableComp";
import getSubjectBr from "components/chat/helpers";
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
    });
    const { firstName, name = null, role = "visitante", userId } = useData();
    const { success, subject, selected } = data;

    // useSupportWaveColor({ trigger: !success });
    useScrollUp();
    useBackColor("var(--themeP)");

    const { socket, chatUserId, chatRoomId, isStored } = useInitSocket({
        namespace: "nspSupport",
        userId,
        role,
    });

    const goChatPanel = () => setData((prev) => ({ ...prev, success: true }));

    useEffect(() => {
        // isStored and chatPreventMainPanel prevents possible duplicates with some reloading here
        if (
            !isStored ||
            chatPreventMainPanel ||
            !selected ||
            !chatUserId ||
            !chatRoomId
        )
            return;

        const body = {
            roomId: chatRoomId,
            chatType: "support",
            dataType: {
                subject,
                subjectOtherLang: getSubjectBr(subject), // to be searchable in query
            },
            userList: {
                userId: chatUserId, // admin dev nucleo-equipe id
                role: role || "visitante",
                userName: name || `Visitante ${getId(5)}`, // first name and surname
            },
        };

        getAPI({
            method: "post",
            url: startSupport(),
            body,
        }).then(() => {
            setTimeout(() => {
                goChatPanel();
            }, 1500);
        });

        // eslint-disable-next-line
    }, [isStored, selected, subject, chatUserId, chatRoomId]);

    const showSubjectSelectField = () => {
        const defaultVal = "Selecione assunto:";
        // LESSON: keep all data in English language, then create a file for translation and use throught the project like getSomethingBr

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

        return (
            <div className="col-md-6">
                <div className="container-center-col">
                    <SelectField
                        title={defaultVal}
                        valuesArray={valuesArray}
                        handleValue={handleSelectValue}
                    />
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
                </div>
            </div>
        );
    };

    const showMain = () => (
        <section className="text-normal text-white">
            <h1 className="my-5">
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
                    seu app? Estamos aqui para te ajudar
                    {firstName ? `, ${firstName}` : ""}!
                </p>
                {showSubjectSelectField()}
            </section>
            {selected && (
                <div className="text-center mb-5 animated fadeInUp text-shadow">
                    Iniciando...
                </div>
            )}
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
