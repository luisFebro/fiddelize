// GLOBAL STATES FOR THE CURRENT MAIN ROOT COMPONENT.
// import { useState } from "react";

export default function useGlobal(props) {
    // const [globalData, setGlobalData] = useState({
    //     abc: "",
    // });

    const store = {
        ...props,
    };

    return store;
}
