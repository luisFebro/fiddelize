import { useState } from "react";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { mainDataList = [] } = props;

    const [data, setData] = useState({
        openChat: !isSmall, // in large screen, keep open.
        openUserCard: false,
        chatData: mainDataList[0] || {}, // the first and most recent message will be selected by default
        darkMode: false,
    });

    const handleNewMsg = (newMsg) => {
        const getFinalData = (currMsgData) => {
            const currMsgList = (currMsgData && currMsgData.msgList) || [];
            const currBubbleId = currMsgList && currMsgList._id;
            const msgs = (currMsgList && currMsgList.msgs) || [];

            let finalMsgs = [];

            // const foundBubble = msgs.find(m => m._id === currBubbleId);
            // if(foundBubble) {
            //     msgs.map(obj => arr2.find(o => o._id === obj.id) || obj);
            // }

            const finalRes = {
                chatData: {
                    ...currMsgList,
                    msgs: [
                        ...msgs,
                        newMsg, // e.g { m: "helo", t: "someUTCdate" }
                    ],
                },
            };

            console.log(finalRes);
        };

        getFinalData(data.chatData);

        setData((currMsgData) => ({
            ...currMsgData,
            // ...getFinalData(currMsgData),
        }));
    };

    const store = {
        ...props,
        ...data,
        setData,
        handleNewMsg,
    };

    return store;
}
