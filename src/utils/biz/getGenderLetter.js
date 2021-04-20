import { useEffect, useState } from "react";
import { getVar } from "../../hooks/storage/useVar";

export default async function getGenderLetter() {
    const gender = await getVar("gender");
    const whichLetter = gender === "Ela" ? "a" : "o";
    return whichLetter;
}

export const useGenderLetter = (options = {}) => {
    const { trigger = true } = options;

    const [genderLetter, setGenderLetter] = useState(null);

    useEffect(() => {
        if (!trigger) return;
        (async () => {
            const gender = await getVar("gender");
            const whichLetter = gender === "Ela" ? "a" : "o";
            setGenderLetter(whichLetter);
        })();
    }, [trigger]);

    return genderLetter;
};
