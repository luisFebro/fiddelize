import { useRef } from "react";

// geared towards performance tests on verifying how many times a component is being rendered, for exemple.
// use it on component which is presenting some lagging or something. This is a strong signal which too many renders are being processed...

export default function useCount(compName) {
    const displayName = compName ? `component ${compName} renders:` : "renders: "
    const renders = useRef(0);
    console.log(displayName, ++renders.current);
};

// ref: https://www.youtube.com/watch?v=-Ls48dd-vJE - React Hooks useCallback and React.memo Tutorial