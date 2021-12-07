import { useEffect } from "react";
import { updateUI, useAction } from "global-data/ui";
import getItems from "init/lStorage";

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);

export default function useSupportWaveColor(
    options = {},
    fromChatPanel = false
) {
    const { trigger = true } = options;

    const uify = useAction();

    useEffect(() => {
        if (!trigger) return;
        // update footer wave color
        const handleBgColor = () => {
            const darkColor = "#1a1a1a";
            const whiteColor = "var(--mainWhite)";
            return chatDarkMode ? darkColor : whiteColor;
        };

        const thisColor = {
            chatBgColor: handleBgColor(),
        };

        if (fromChatPanel) thisColor.chatDarkMode = chatDarkMode;

        updateUI("global", thisColor, uify);
        // eslint-disable-next-line
    }, [trigger, fromChatPanel]);
}
