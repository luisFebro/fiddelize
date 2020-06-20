import { useEffect } from 'react';
import animateNumber, { getAnimationDuration } from '../../utils/numbers/animateNumber';

export default function useAnimateNumber(elemRef, targetNumber, options = {}) {
    if(typeof targetNumber !== "number") throw new Error("You should specify a number at the second argument")

    let { trigger, callback } = options;

    useEffect(() => {
        let cancel;
        const startingNumber = 0;
        const runAnimation = () => {
            animateNumber(
                elemRef,
                startingNumber,
                targetNumber,
                getAnimationDuration(targetNumber),
                callback
            );
        }

        if(cancel) return;
        trigger && runAnimation();

        return () => { cancel = true }
    }, [trigger, elemRef, targetNumber])
}