import { useState, useEffect } from "react";
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import observeElemView from '../../utils/window/observeElemView';

// detects if a specific element is visible on the screen.
export default function useElemShowOnScroll(elem, options = {}) {
    const { withObserver, needPreload, detectionOnce, tSpan } = options;
    const [didShow, setDidShow] = useState(false);

    useEffect(() => {
        if(withObserver) {
            const options = { rootMargin: 200, needPreload, animaIn: "fadeInBottomLeft", speed: "slow", }
            observeElemView(elem, res => setDidShow(res), options);
        } else {
            const options = { throttleSpan: tSpan || 300, detectionOnce }
            checkIfElemIsVisible(elem, res => setDidShow(res), options);
        }
    }, [withObserver])

    return didShow;
};