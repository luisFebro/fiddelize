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
import { Load } from "components/code-splitting/LoadableComp";
import { useVar } from "init/var";
// import useSupportWaveColor from "./useSupportWaveColor";

const [loggedRole] = getItems("currUser", ["role"]);
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
        chatUserId: null,
        selected: false,
        success: isFiddelizeTeam,
    });
    const { firstName, name = null, role = null, userId } = useData();
    const { success, subject, chatUserId, selected } = data;

    /* need to set as JSON.stringify-ed from the oldest to the newest
        record it to every new started chat:
        const chts = {
            [roomId1]: [{ msg1: "sdad" }, { msg2: "s"}],
            [roomId2]: [{ msg1: "sdad" }, { msg2: "s"}],
        }
    */
    const userGotChatHistory = useVar("chts", { dots: true });
    // useSupportWaveColor({ trigger: !success });
    useScrollUp();
    useBackColor("var(--themeP)");
    useHandleUserId(userId, setData);

    const goChatPanel = () => setData((prev) => ({ ...prev, success: true }));

    useEffect(() => {
        if (!selected || !chatUserId) return;

        const body = {
            roomId: getId(),
            chatType: "support",
            dataType: {
                subject,
            },
            userList: {
                userId: chatUserId, // admin dev nucleo-equipe id
                role: role || "visitante",
                userName: name || "Visitante", // first name and surname
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
    }, [selected, subject, chatUserId]);

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
                            if (userGotChatHistory === "...")
                                return showToast("Carregando...");
                            if (!userGotChatHistory)
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
                <AsyncChat chatUserId={chatUserId} role={role} />
            ) : (
                showMain()
            )}
        </Fragment>
    );
}

// HOOKS
function useHandleUserId(userId, setData) {
    useEffect(() => {
        // handling visitors uniqueId
        if (!userId) {
            const [chatVisitorId] = getItems("global", ["chatVisitorId"]);
            if (!chatVisitorId) {
                const newVisitorId = `visitor-${getId()}`;

                setItems("global", {
                    chatVisitorId: newVisitorId,
                });
                return setData((prev) => ({
                    ...prev,
                    chatUserId: newVisitorId,
                }));
            }

            return setData((prev) => ({ ...prev, chatUserId: chatVisitorId }));
        }

        return setData((prev) => ({ ...prev, chatUserId: userId }));
    }, [userId]);
}
// END HOOKS
