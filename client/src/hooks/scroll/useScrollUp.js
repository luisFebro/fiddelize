import { useEffect } from "react";

export default function useScrollUp() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
}
