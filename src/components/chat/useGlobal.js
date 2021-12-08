import { useState, useEffect } from "react";
import { setItems } from "init/lStorage";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { mainDataList: dbMainList } = props;

    const [data, setData] = useState({
        openChat: !isSmall, // in large screen, keep open.
        openUserCard: false,
        currChatData: dbMainList[0] || {}, // the first and most recent message will be selected by default
        darkMode: false,
        clearFieldMsg: false,
        mainDataList: [],
    });

    useEffect(() => {
        if (!dbMainList.length) return null;

        const thisCurrChatData = data.mainDataList[0] || dbMainList[0] || {};
        const lastPendingSupport =
            thisCurrChatData &&
            thisCurrChatData.dataType &&
            thisCurrChatData.dataType.isPendingSupport;
        // Especially for customers - if there is a pending support as the last chat, don't switch back to main support panel, but keep the user logged in the chat support panel
        if (lastPendingSupport)
            setItems("global", {
                chatPreventMainPanel: true,
            });

        return setData((prev) => ({
            ...prev,
            mainDataList: data.mainDataList.length
                ? data.mainDataList
                : dbMainList,
            // load most recent chat as the most recent
            currChatData: thisCurrChatData,
        }));
        // eslint-disable-next-line
    }, [dbMainList.length, data.mainDataList]);

    const store = {
        ...props,
        ...data,
        setData,
    };

    return store;
}
