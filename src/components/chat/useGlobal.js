import { useState, useEffect } from "react";
import { setItems } from "init/lStorage";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { list: dbList } = props.dataChatList;

    const [data, setData] = useState({
        openChat: !isSmall, // in large screen, keep open.
        openUserCard: false,
        currRoomId: dbList[0] && dbList[0].roomId,
        darkMode: false,
        typing: {
            display: false,
            name: null,
            roomId: null,
        },
        // store all last msgs
        tempLastPanelMsg: {},
        lastPanelMsg: {
            msg: null,
            roomId: null,
        },
    });

    const lastPendingSupport =
        dbList[0] && dbList[0].dataType && dbList[0].dataType.isPendingSupport;

    useEffect(() => {
        if (!lastPendingSupport) return;

        setItems("global", {
            chatPreventMainPanel: true,
            chatHistoryOn: true,
        });
    }, [lastPendingSupport]);

    const currChatData = getCurrChatData(dbList, data.currRoomId);

    const store = {
        ...props,
        ...data,
        setData,
        dbList,
        currChatData,
    };

    return store;
}

// HELPERS
function getCurrChatData(list, roomId) {
    if (!list || !list[0] || !roomId) return list[0] || {};
    return list.find((session) => session.roomId === roomId) || {}; // even with list and roomId, it can't be found when filtering
}
// END HELPERS

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
