import { useEffect } from "react";
import getDayGreetingBr from "utils/getDayGreetingBr";
import { isAlreadyAllowed } from "components/pwa-push-notification/pushNotifPermission";
import isWorkingHour from "./working-hour/isWorkingHour";

export default function useAutoMsgBot({
    saveNewMsg,
    userName,
    subject,
    activateBot = false, // a bot only to introduction msg in version 4.98
    activateBot2 = false,
    activateBot3 = false,
    setData,
    roomId,
    setCurrData,
    role,
    lastBotMsg,
    lastMsgType,
    lastCustomerMsg,
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

    // BOT INTRUDUCTION
    useEffect(() => {
        if (!activateBot || !roomId) return;

        setTypingBot(true);

        setTimeout(() => {
            setTypingBot(false);

            const botMsg = pickBotMsg({ userName, subject });
            saveNewMsg(botMsg);
        }, 4000);

        // eslint-disable-next-line
    }, [activateBot, roomId, userName]);

    const isSuitableUser = role === "visitante" && !isAlreadyAllowed;

    // BOT COMUNICATION REQUEST - push notification
    useEffect(() => {
        // check if the nofitication is already available for logged-in or even visitor with an account.
        if (!activateBot2 || !isSuitableUser) return;
        setTimeout(() => {
            setTypingBot(true);

            setTimeout(() => {
                setTypingBot(false);
                const botMsg2 = pickBotMsg2({ role, userName });
                saveNewMsg(botMsg2);
                saveNewMsg("func:pushNotif", {
                    msgType: "func",
                    updateBizRooms: false,
                });
            }, 4000);
        }, 30000);

        // eslint-disable-next-line
    }, [activateBot2, isSuitableUser, userName]);

    // BOT COMUNICATION REQUEST - email
    useEffect(() => {
        if (!lastMsgType || lastMsgType === "bot") return null;
        // ig the user has the last attempted as a failure email, then repeat by allow to proceed to register the email.
        const isLastEmailInvalid =
            activateBot3 === false &&
            lastBotMsg &&
            lastBotMsg.includes("Ops!!! Parece que");
        if (isLastEmailInvalid)
            return checkEmailAndSetMsg({
                lastCustomerMsg,
                setTypingBot,
                saveNewMsg,
                userName,
            });
        if (!activateBot3 || !isSuitableUser) return null;

        return checkEmailAndSetMsg({
            lastCustomerMsg,
            setTypingBot,
            saveNewMsg,
            userName,
        });
    }, [
        lastMsgType,
        lastBotMsg,
        lastCustomerMsg,
        userName,
        activateBot3,
        isSuitableUser,
    ]);
}

function pickBotMsg(data) {
    const { userName } = data;

    const greeting = getDayGreetingBr();
    const userGreeting = `${greeting}, ${userName && userName.cap()}`;

    return chooseMsg({ ...data, userGreeting });
}

function pickBotMsg2(data) {
    const { role, userName } = data;

    if (role === "visitante") {
        return `${
            userName && userName.cap()
        }, deseja receber notificação assim que um de nossos atendentes humanos estiver disponível?`;
    }
    return `Ok, você receberá uma notificação ou pelo seu email cadastrado assim que te enviar um retorno. \n\nVocê sempre pode retornar aqui para acompanhar seus atendimentos: https://fiddelize.com.br/suporte.`;
    // const isWorkingHour = isWorkingHour();

    // if (role === "visitante")
    //     return `Ok, ${userName && userName.cap()}. ${
    //         isWorkingHour
    //             ? "Caso você não receba nenhuma retorno em 15 minutos, "
    //             : ""
    //     } ${
    //         isUnavailable ? "p" : "P"
    //     }or favor, informe seu email principal. Mandaremos uma mensagem de retorno o mais breve possível via email.\n\nVocê sempre pode retornar aqui para ver seu histórico de atendimento: https://fiddelize.com.br/suporte.`;
}

// HELPERS
function chooseMsg({ userGreeting, userName, subject }) {
    // Check if working hours, if not send a message that attendance is not available and will reach out as soon as possible
    const unavailableMsg = `${
        userName && userName.cap()
    }, o suporte Fiddelize funciona das 9 às 18 horas de Segunda a Sábado, mas fica à vontade para deixar sua mensagem e responderemos logo.`;
    if (!isWorkingHour()) return unavailableMsg;

    if (subject === "suggestion")
        return `
        ${userName}, qual sugestão você tem em mente?
    `;

    if (subject === "question")
        return `
        Qual dúvida sobre a Fiddelize você possui?
    `;

    if (subject === "usageHelp")
        return `
        ${userName}, em qual funcionalidade você precisa de ajuda?
    `;

    if (subject === "bugReport")
        return `
        ${userName}, descreva a falha em detalhes ou mande um print/foto explicando o problema. Vamos te ajudar o mais breve possível.
    `;

    if (subject === "others")
        return `
        ${userName}, qual assunto sobre a Fiddelize você gostaria de conversar?
    `;

    return "";
}

function checkEmailAndSetMsg({
    lastCustomerMsg,
    setTypingBot,
    saveNewMsg,
    userName,
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
            },
        };
        saveNewMsg(
            `Tudo certo, ${
                userName && userName.cap()
            }! Você receberá uma notificação ou email assim que um atendente humano estiver disponível.\n\nApós o atendimento, você pode clicar em finalizar para terminar atendimento.`,
            attachData
        );
    }, 2500);

    return null;
}

function validateEmail(email) {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
}
// END HELPERS
