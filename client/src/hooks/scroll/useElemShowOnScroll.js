import { useState, useEffect } from "react";
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';

export default function useElemShowOnScroll(elem, options = {}) {
    const { detectionOnce, tSpan } = options;
    const [didShow, setDidShow] = useState(false);

    useEffect(() => {
        const options = { throttleSpan: tSpan || 300, detectionOnce }
        checkIfElemIsVisible(".target--app-show-case", res => setDidShow(res), options);
    }, [])

    return didShow;
};