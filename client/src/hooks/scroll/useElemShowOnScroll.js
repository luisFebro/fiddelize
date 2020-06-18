import { useState, useEffect } from "react";
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import observeElemView from '../../utils/window/observeElemView';

// detects if a specific element is visible on the screen.
export default function useElemShowOnScroll(elem, options = {}) {
    const { withObserver, rootMargin, once, needPreload, animaIn, speed, detectionOnce, tSpan, trueOnload } = options;
    const [didShow, setDidShow] = useState(false);

    useEffect(() => {
        if(withObserver) {
            const theseOptions = { rootMargin: rootMargin || 0, once, needPreload, animaIn, speed, }
            observeElemView(elem, res => setDidShow(res), theseOptions);
        } else {
            const theseOptions = { throttleSpan: tSpan || 300, detectionOnce }
            checkIfElemIsVisible(elem, res => setDidShow(res), theseOptions);
        }
    }, [withObserver, elem])

    if(!elem && trueOnload) return true;

    return didShow;
};