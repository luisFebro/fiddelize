import { useState } from "react";
// import useData from "init";

const isSmall = window.Helper.isSmallScreen();

export default function useGlobal(props) {
    const { mainDataList = [] } = props;

    const [data, setData] = useState({
        openChat: !isSmall,
        chatData: mainDataList[0] || {}, // the first and most recent message will be selected by default
        darkMode: false,
    });

    const store = {
        ...props,
        ...data,
        setData,
    };

    return store;
}
