// detect when user is scrolling up to trigger some action
import React, { useEffect, useState } from "react";
import detectScrollDirection from "../../utils/window/detectScrollDirection";

export default function useDetectScrollUp() {
    const [isScrollingUpward, setScrollingUpward] = useState(false);

    useEffect(() => {
        detectScrollDirection((dirUp) => setScrollingUpward(dirUp));
    }, []);

    return isScrollingUpward;
}
