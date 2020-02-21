import { useRef } from "react";

export const useCountRenders = () => {
    const renders = useRef(0);
    console.log("renders: ", renders.current++);
};

// ref: https://www.youtube.com/watch?v=-Ls48dd-vJE - React Hooks useCallback Tutorial