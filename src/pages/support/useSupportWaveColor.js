import { useEffect } from "react";
import { updateUI, useAction } from "global-data/ui";

export default function useSupportWaveColor(
    color = "var(--themePDark)",
    options = {}
) {
    const { trigger = true } = options;

    const uify = useAction();

    useEffect(() => {
        if (!trigger) return;
        // update footer wave color
        const isDarkMode = color === "#1a1a1a";
        const thisColor = {
            chatDarkMode: isDarkMode,
            chatBgColor: color,
        };

        updateUI("global", thisColor, uify);
        // eslint-disable-next-line
    }, [trigger]);
}
