import { useState, useEffect } from "react";
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';

// detects if a specific element is visible on the screen.
export default function useElemShowOnScroll(elem, options = {}) {
    const { detectionOnce, tSpan } = options;
    const [didShow, setDidShow] = useState(false);

    useEffect(() => {
        const options = { throttleSpan: tSpan || 300, detectionOnce }
        checkIfElemIsVisible(elem, res => setDidShow(res), options);
    }, [])

    return didShow;
};