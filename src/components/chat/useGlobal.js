import { useState } from "react";
// import useData from "init";

export default function useGlobal(props) {
    // const { userGame } = useData();
    const [data, setData] = useState({
        openChat: false,
        chatData: {},
        showUserInfo: false,
        userInfoData: {},
        darkMode: false,
    });

    const store = {
        ...props,
        ...data,
        setData,
    };

    return store;
}
