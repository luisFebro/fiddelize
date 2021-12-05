import { useState, useEffect } from "react";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { mainDataList: dbMainList } = props;

    const [data, setData] = useState({
        openChat: !isSmall, // in large screen, keep open.
        openUserCard: false,
        chatData: dbMainList[0] || {}, // the first and most recent message will be selected by default
        darkMode: false,
        clearFieldMsg: false,
        mainDataList: [],
    });

    useEffect(() => {
        if (!dbMainList.length) return null;
        return setData((prev) => ({
            ...prev,
            mainDataList: dbMainList,
        }));
    }, [dbMainList.length]);

    const store = {
        ...props,
        ...data,
        setData,
    };

    return store;
}
