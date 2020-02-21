import React, { useState, useEffect } from 'react';
import {default as LProgress} from '@material-ui/core/LinearProgress';
import { useStoreState } from 'easy-peasy';
// ref: https://material-ui.com/components/progress/

export default function LinearProgress() {
    const [completed, setCompleted] = useState(0);
    const isLoading = useStoreState(state => state.globalReducer.cases.isLinearPLoading);

    const showLinearProgress = isLoading => {
        return(
            isLoading &&
            <LProgress variant="determinate" color="secondary" value={completed} />
        );
    }

    useEffect(() => {
        function progress() {
            setCompleted(oldCompleted => {
                let diff;
                if(oldCompleted === 100) {
                    return 15;
                }
                if(oldCompleted === 90) {
                    // slower
                    diff = Math.random() * 1;

                } else {
                    diff = Math.random() * 10;
                }
                return Math.min(oldCompleted + diff, 100);
            });
        }

        const timer = setInterval(progress, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 2000}}>
            {showLinearProgress(isLoading)}
        </div>
    );
}