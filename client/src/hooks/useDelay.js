import { useState, useEffect } from "react";

// delay something especially an asyncronous component for lazy loading/preloading and return its ready status
export default function useDelay(miliseconds) {
    const [ready, setStatus] = useState(false);

    useEffect(() => {
        setTimeout(() => setStatus(true), miliseconds);
    }, [])

    return ready;
};