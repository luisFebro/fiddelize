import { useEffect, useState } from "react";
import detectSingleElemScroll from "../../utils/window/detectSingleElemScroll";

export default function useDetectScrollSingle(elemQuery) {
    const [isIntersected, setIntersected] = useState(false);

    useEffect(() => {
        elemQuery &&
            detectSingleElemScroll(elemQuery, {
                callback: (isShown) => setIntersected(isShown),
            });
    }, [elemQuery]);

    return isIntersected;
}
