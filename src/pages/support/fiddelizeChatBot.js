import { useEffect } from "react";
import getDayGreetingBr from "utils/getDayGreetingBr";
import isWorkingHour from "./working-hour/isWorkingHour";

export default function useAutoMsgBot({
    saveNewMsg,
    userName,
    subject,
    activateBot = false, // a bot only to introduction msg in version 4.98
    setData,
    roomId,
    setCurrData,
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

            const botMsg = pickBotMsg({ userName, subject, msg: 1 });
            saveNewMsg(botMsg);
        }, 7000);
    }, [activateBot, roomId]);
}

function pickBotMsg(data) {
    const { userName } = data;

    const greeting = getDayGreetingBr();
    const userGreeting = `${greeting}, ${userName}`;

    return chooseMsg({ ...data, userGreeting });
}

// HELPERS
function chooseMsg({ userGreeting, userName, subject }) {
    // Check if working hours, if not send a message that attendance is not available and will reach out as soon as possible
    const unavailableMsg = `Olá ${userName}! O suporte Fiddelize funciona das 9 às 18 horas de Segunda a Domingo. Deixe sua mensagem e responderemos logo.`;
    if (!isWorkingHour()) return unavailableMsg;

    if (subject === "suggestion")
        return `
        ${userGreeting}! Qual sugestão você tem em mente?
    `;

    if (subject === "question")
        return `
        Olá ${userName}! Qual dúvida sobre a Fiddelize você possui?
    `;

    if (subject === "usageHelp")
        return `
        ${userName}, qual funcionalidade você precisa de ajuda?
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
