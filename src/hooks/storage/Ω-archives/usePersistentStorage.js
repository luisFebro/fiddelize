import { useEffect } from "react";
// https://web.dev/persistent-storage/

export default function usePersistentStorage() {
    useEffect(() => {
        (async () => {
            if (navigator.storage && navigator.storage.persist) {
                const isPersisted = await navigator.storage.persist();
                console.log(`Persisted storage granted: ${isPersisted}`);
            }
        })();
    }, []);
}
