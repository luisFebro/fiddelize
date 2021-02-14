import { useState, useEffect } from "react";
import userScrolled from "../../utils/window/userScrolled";

export default function useDidScroll() {
    const [didScroll, setDidScroll] = useState(false);

    useEffect(() => {
        userScrolled(() => setDidScroll(true));
    }, []);

    return didScroll;
}
