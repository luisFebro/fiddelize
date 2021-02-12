import { useEffect } from 'react';

export default function useBackColor(color) {
    if(typeof color !== "string") throw new Error("Need the first argument COLOR as a string")

    useEffect(() => {
        let cancel;

        document.body.style.setProperty('background', color, 'important');

        if(cancel) {
            document.body.style.setProperty('background', `var(--themeBackground--default)`, 'important');
        }

        return () => { cancel = true };
    }, [color]);
}