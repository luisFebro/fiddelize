import { useEffect, useState } from "react";
import { getVar, store } from "../storage/useVar";

export default function useSexLetter(options = {}) {
    const { trigger = true } = options;

    const [sexLetter, setSexLetter] = useState(null);

    useEffect(() => {
        if (!trigger) return;
        (async () => {
            const letter = await getVar("sexLetter", store.user);
            setSexLetter(letter);
        })();
    }, [trigger]);

    return sexLetter;
}
