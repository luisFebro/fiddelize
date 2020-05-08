import React, { useState, useEffect } from 'react';
import {default as LProgress} from '@material-ui/core/LinearProgress';
import { useStoreState } from 'easy-peasy';
// ref: https://material-ui.com/components/progress/

function LinearProgress({needDeterminate = false}) {
    const [completed, setCompleted] = useState(0);
    const isLoading = useStoreState(state => state.globalReducer.cases.isLinearPLoading);

    const styles = {
        progress: {
            color: 'var(--themeS)',
            backgroundColor: 'var(--mainWhite)'
        }
    }

    const showLinearProgress = isLoading => {
        return(
            isLoading &&
            <LProgress variant="indeterminate" style={styles.progress} thickness={5} value={needDeterminate ? completed : null} />
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

export default React.memo(LinearProgress);