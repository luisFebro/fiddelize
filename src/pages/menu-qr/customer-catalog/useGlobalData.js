// import { useState } from "react";
// import useContext from "context"; const props = useContext();

export default function useGlobalData(props) {
    // const [data, setData] = useState({
    //     openUserCard: false,
    // });

    const store = {
        ...props,
        // ...data,
    };

    return store;
}
