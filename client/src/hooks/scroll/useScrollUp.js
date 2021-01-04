import { useEffect } from "react";

export default function useScrollUp() {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        // not work with useEffect
        window.scrollTo(0, 0);
    }, []);
}
