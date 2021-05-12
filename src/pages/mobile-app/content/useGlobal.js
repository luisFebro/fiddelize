import { useState } from "react";
import useData from "init";

export default function useGlobal(props) {
    const { userGame } = useData();
    const [currGame, setCurrGame] = useState(userGame && userGame.currGame);

    const store = {
        ...props,
        currGame,
        setCurrGame,
    };

    return store;
}
