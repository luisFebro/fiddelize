import { useCallback } from "react";

export const checkDetectedElem = ({ list, ind: currInd, indFromLast = 0 }) => {
    // lastCard ind is 0;
    return list.length - indFromLast === currInd;
};

export default function useElemDetection({
    loading,
    hasMore,
    setSkip,
    handleSkip,
    isOffline = false,
    isFiltering = false,
}) {
    return useCallback(
        (elem) => {
            if (isFiltering) return;
            if (isOffline) return;
            if (loading) return; // constantly calls the API ifwe do not return...

            const currObserver = new IntersectionObserver((entries, self) => {
                const entry = entries[0];
                const detection = entry.isIntersecting && hasMore;
                if (detection) {
                    console.log("VISIBLE CARD DETECTED");
                    if (handleSkip) {
                        handleSkip();
                    } else {
                        setSkip((prevSkip) => prevSkip + 1);
                    }
                    self.unobserve(entry.target);
                }
            });

            if (elem) currObserver.observe(elem);
        },
        [loading, hasMore]
    );
}
