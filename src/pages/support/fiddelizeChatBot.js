import { useEffect, useState } from "react";
import getDayGreetingBr from "utils/getDayGreetingBr";
import getSubjectBr from "components/chat/helpers";
import isWorkingHour from "./working-hour/isWorkingHour";

export default function useAutoMsgBot({
    saveNewMsg,
    userName,
    subject,
    msgBot01 = false, // essencial communication - push notif (visitor) - can be skipped if logged in user
    msgBot02 = false, // essencial communication - email (visitor) - can be skipped if logged in user
    msgBot1 = false, // introduction question
    setData,
    roomId,
    setCurrData,
    role,
    lastBotMsg,
    lastMsgType,
    lastCustomerMsg,
    loggedUserEmail,
}) {
    const setTypingBot = (status = true) => {
        // show in the side panel
        setData((prev) => ({
            ...prev,
            typing: {
                roomId,
                display: status,
                name: "Fidda Bot",
            },
        }));

        // show in the main content chat
        setCurrData((prev) => ({
            ...prev,
            bot: {
                typingShow: status,
                senderName: status ? "Fidda Bot" : null,
            },
        }));
    };

    // BOT COMUNICATION REQUEST - push notification
    useEffect(() => {
        if (!msgBot01) return;

        setTypingBot(true);

        setTimeout(() => {
            setTypingBot(false);

            const botMsg = pickBotMsg01({ userName });
            saveNewMsg(botMsg);
            saveNewMsg("func:pushNotif", {
                msgType: "func",
                updateBizRooms: false,
            });
        }, 4000);

        // eslint-disable-next-line
    }, [msgBot01, userName, role]);

    // BOT COMUNICATION REQUEST - email
    useEffect(() => {
        // lastMsgType === "bot" prevents send a message if the last one was a bot msg
        if (
            (lastBotMsg && lastBotMsg.includes("Tudo certo")) ||
            lastMsgType === "bot"
        )
            return null;
        // if the user has the last attempted as a failure email, then repeat by allow to proceed to register the email.
        const isLastEmailInvalid =
            lastBotMsg && lastBotMsg.includes("Ops!!! Parece que");
        if (isLastEmailInvalid) {
            checkEmailAndSetMsg({
                lastCustomerMsg,
                setTypingBot,
                saveNewMsg,
                userName,
                subject,
            });

            return null;
        }

        if (!msgBot02) return null;

        return checkEmailAndSetMsg({
            lastCustomerMsg,
            setTypingBot,
            saveNewMsg,
            userName,
            subject,
        });
    }, [msgBot02, lastBotMsg, lastMsgType, lastCustomerMsg, userName, subject]);

    // somehow, it is repeating the message twice
    const [already, setAlready] = useState(false);
    useEffect(() => {
        if (!msgBot1 || already) return;

        setTimeout(() => {
            setTypingBot(true);

            setTimeout(() => {
                setTypingBot(false);
                if (role !== "visitante") {
                    const attachData = {
                        notifyData: {
                            customerEmail: loggedUserEmail,
                            subjectBr: getSubjectBr(subject),
                        },
                    };

                    saveNewMsg(
                        `${getDayGreetingBr()}, ${
                            userName && userName.cap()
                        }! Você receberá uma notificação pelo app ou via email cadastrado (${loggedUserEmail}) assim que um atendente humano estiver disponível.`,
                        attachData
                    );
                    setTimeout(() => {
                        const botMsg = pickBotMsg1({ userName, subject });
                        saveNewMsg(botMsg);
                    }, 2000);
                }
                setAlready(true);
            }, 4000);
        }, 500);
        // eslint-disable-next-line
    }, [msgBot1, already, subject]);
}

function pickBotMsg01(data) {
    const { userName } = data;

    const greeting = getDayGreetingBr();
    const userGreeting = `${greeting}, ${userName && userName.cap()}`;

    return `${userGreeting}! Deseja receber uma notificação via site assim que um de nossos atendentes humanos estiver disponível?`;
}

function pickBotMsg1(data) {
    const { userName, subject } = data;

    return chooseMsg({
        ...data,
        userName: userName && userName.cap(),
        subject,
    });
}

// HELPERS
function chooseMsg({ userName, subject }) {
    // Check if working hours, if not send a message that attendance is not available and will reach out as soon as possible
    const unavailableMsg = `${userName}, o suporte Fiddelize funciona das 9 às 18 horas de Segunda a Sábado, mas fica à vontade para deixar sua mensagem e responderemos logo.`;
    if (!isWorkingHour()) return unavailableMsg;

    if (subject === "suggestion")
        return `
        Enquanto isso, ${userName}, qual sugestão você tem em mente?
    `;

    if (subject === "question")
        return `
        Qual dúvida sobre a Fiddelize você possui?
    `;

    if (subject === "usageHelp")
        return `
        Enquanto isso, em qual funcionalidade você precisa de ajuda?
    `;

    if (subject === "bugReport")
        return `
        Enquanto isso, ${userName}, descreva a falha em detalhes ou mande um print/foto explicando o problema. Vamos te ajudar o mais breve possível.
    `;

    if (subject === "others")
        return `
        Enquanto isso, ${userName}, qual assunto sobre a Fiddelize você gostaria de conversar?
    `;

    return "";
}

function checkEmailAndSetMsg({
    lastCustomerMsg,
    setTypingBot,
    saveNewMsg,
    userName,
    subject,
}) {
    const isValidEmail = validateEmail(lastCustomerMsg);
    if (!isValidEmail) {
        setTypingBot(true);
        setTimeout(() => {
            setTypingBot(false);
            saveNewMsg(
                "Ops!!! Parece que seu email está incorreto. Digite um email válido.",
                { updateBizRooms: false }
            );
        }, 2500);
        return null;
    }

    setTypingBot(true);
    setTimeout(() => {
        setTypingBot(false);
        const attachData = {
            notifyData: {
                customerEmail: lastCustomerMsg,
                subjectBr: getSubjectBr(subject),
            },
        };
        saveNewMsg(
            `Tudo certo, ${
                userName && userName.cap()
            }! Você receberá uma notificação ou email assim que um atendente humano estiver disponível.`,
            attachData
        );

        setTimeout(() => {
            const botMsg = pickBotMsg1({ userName, subject });
            saveNewMsg(botMsg);
        }, 2000);
    }, 2500);

    return null;
}

function validateEmail(email) {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
}
// END HELPERS
