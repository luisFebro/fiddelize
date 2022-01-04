import { useEffect } from "react";
import getDayGreetingBr from "utils/getDayGreetingBr";
import isWorkingHour from "./working-hour/isWorkingHour";

export default function useAutoMsgBot({
    saveNewMsg,
    userName,
    subject,
    activateBot = false, // a bot only to introduction msg in version 4.98
    activateBot2 = false,
    setData,
    roomId,
    setCurrData,
    role,
}) {
    const toggleBot = (status = true) => {
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

    useEffect(() => {
        if (!activateBot || !roomId) return;

        toggleBot(true);

        setTimeout(() => {
            toggleBot(false);

            const botMsg = pickBotMsg({ userName, subject });
            saveNewMsg(botMsg);
        }, 4000);
    }, [activateBot, roomId, userName]);

    useEffect(() => {
        if (!activateBot2) return;
        setTimeout(() => {
            toggleBot(true);

            setTimeout(() => {
                toggleBot(false);
                const botMsg2 = pickBotMsg2({ role, userName });
                saveNewMsg(botMsg2);
            }, 4000);
        }, 30000);
    }, [activateBot2, role, userName]);
}

function pickBotMsg(data) {
    const { userName } = data;

    const greeting = getDayGreetingBr();
    const userGreeting = `${greeting}, ${userName}`;

    return chooseMsg({ ...data, userGreeting });
}

function pickBotMsg2(data) {
    const { role, userName } = data;

    const isUnavailable = !isWorkingHour();

    if (role === "visitante")
        return `Ok, ${userName}. ${
            isUnavailable
                ? "Caso você não receba nenhuma retorno em 15 minutos, "
                : ""
        } ${
            isUnavailable ? "p" : "P"
        }or favor, informe seu email principal. Mandaremos uma mensagem de retorno o mais breve possível via email.\n\nVocê sempre pode retornar aqui para ver seu histórico de atendimento: https://fiddelize.com.br/suporte.`;

    return `Ok, você receberá uma notificação ou pelo seu email cadastrado assim que te enviar um retorno.\n\nVocê sempre pode retornar aqui para ver seu histórico de atendimento: https://fiddelize.com.br/suporte.`;
}

// HELPERS
function chooseMsg({ userGreeting, userName, subject }) {
    // Check if working hours, if not send a message that attendance is not available and will reach out as soon as possible
    const unavailableMsg = `Olá ${userName}! O suporte Fiddelize funciona das 9 às 18 horas de Segunda a Sábado. Deixe sua mensagem e responderemos logo.`;
    if (!isWorkingHour()) return unavailableMsg;

    if (subject === "suggestion")
        return `
        ${userGreeting}! Qual sugestão você tem em mente?
    `;

    if (subject === "question")
        return `
        ${userGreeting}! Qual dúvida sobre a Fiddelize você possui?
    `;

    if (subject === "usageHelp")
        return `
        ${userGreeting}!, qual funcionalidade você precisa de ajuda?
    `;

    if (subject === "bugReport")
        return `
        ${userName}, descreva a falha em detalhes ou mande um print/foto explicando o problema. Vamos te ajudar o mais breve possível.
    `;

    if (subject === "others")
        return `
        ${userGreeting}! Qual assunto sobre a Fiddelize você gostaria de conversar?
    `;

    return "";
}

// END HELPERS
