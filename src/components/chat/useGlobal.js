import { useState, useEffect } from "react";
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

        return setData((prev) => ({
            ...prev,
            mainDataList: data.mainDataList.length
                ? data.mainDataList
                : dbMainList,
            // load most recent chat as the most recent
            currChatData: data.mainDataList[0] || dbMainList[0] || {},
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
