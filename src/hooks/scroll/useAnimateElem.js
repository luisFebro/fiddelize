import { useState, useEffect } from "react";
import animateVisibleElem from "../../utils/window/animateVisibleElem";

export default function useAnimateElem(elem, options) {
    const [didView, setDidView] = useState(false);

    useEffect(() => {
        animateVisibleElem(elem, () => setDidView(true), options);
    }, []);

    return didView;
}
