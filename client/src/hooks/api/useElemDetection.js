import { useCallback } from 'react';

export const checkDetectedElem = ({ list, ind: currInd, indFromLast = 0 }) => {
    // lastCard ind is 0;
    return (list.length - indFromLast) === currInd;
}

export default function useElemDetection({ observer, loading, hasMore, setSkip }) {
    return useCallback(elem => {
        let currObserver = observer.current;
        if(loading) return; // constantly calls the API ifwe do not return...

        currObserver = new IntersectionObserver((entries, self) => {
            const entry = entries[0];
            const detection = entry.isIntersecting && hasMore;
            if(detection) {
                console.log("VISIBLE CARD DETECTED")
                setSkip(prevSkip => prevSkip + 1);
                self.unobserve(entry.target);
            }
        })

        if(elem) currObserver.observe(elem)
    }, [loading, hasMore])
}