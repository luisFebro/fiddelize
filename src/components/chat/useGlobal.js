import { useState, useEffect } from "react";
import { removeItems, setItems } from "init/lStorage";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { list: dbList, loading } = props.dataChatList;

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
        if (loading) return null;

        if (!lastPendingSupport) {
            return removeItems("global", [
                "chatPreventMainPanel",
                "chatRoomId",
            ]);
        }

        return setItems("global", {
            chatPreventMainPanel: true,
            // to notify user whether s/he has previously added chat support when clicking on the see-history button. should only be assigned once
            chatHistoryOn: true,
        });
    }, [lastPendingSupport, loading]);

    const [currChatData, currInd] = getCurrChatData(dbList, data.currRoomId);

    const store = {
        ...props,
        ...data,
        setData,
        dbList,
        currChatData,
        currInd,
    };

    return store;
}

// HELPERS
function getCurrChatData(list, roomId) {
    if (!list || !list[0] || !roomId) return [list[0] || {}];
    const foundChat = list.find((session) => session.roomId === roomId) || {}; // even with list and roomId, it can't be found when filtering
    const currInd = list.findIndex((session) => session.roomId === roomId) || 0;
    return [foundChat, currInd];
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
