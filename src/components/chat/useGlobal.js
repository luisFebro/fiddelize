import { useState, useEffect } from "react";
import { setItems } from "init/lStorage";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { dataChatList } = props;
    const { list } = dataChatList;

    const [data, setData] = useState({
        openChat: !isSmall, // in large screen, keep open.
        openUserCard: false,
        currRoomId: list[0] && list[0].roomId,
        currChatData: list[0] || {}, // the first and most recent message will be selected by default
        darkMode: false,
        clearFieldMsg: false,
    });

    useEffect(() => {
        if (!list.length) return null;

        const thisCurrChatData = list[0];
        const lastPendingSupport =
            thisCurrChatData &&
            thisCurrChatData.dataType &&
            thisCurrChatData.dataType.isPendingSupport;
        // Especially for customers - if there is a pending support as the last chat, don't switch back to main support panel, but keep the user logged in the chat support panel
        if (lastPendingSupport)
            setItems("global", {
                chatPreventMainPanel: true,
                chatHistoryOn: true,
            });

        return setData((prev) => ({
            ...prev,
            currChatData: thisCurrChatData,
        }));

        // eslint-disable-next-line
    }, [list]);

    const store = {
        ...props,
        ...data,
        setData,
    };

    return store;
}

/* ARCHIVES

return setData((prev) => ({
    ...prev,
    mainDataList: list,
    // mainDataList: data.mainDataList.length
    //     ? data.mainDataList
    //     : list,
    // load most recent chat as the most recent
    currChatData: thisCurrChatData,
}));

*/
