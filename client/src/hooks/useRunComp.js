import { setRun as runThisComp } from '../redux/actions/globalActions';
import { useStoreState } from 'easy-peasy';

export const setRun = (dispatch, compName) => {
    if(compName) {
        runThisComp(dispatch, compName);
    }
}

export const useRunComp = () => {
    const { run, runName } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
    }))

    return({
        run,
        runName,
    });

}


// export cosnt toggleRun = compName => {
//     if(compName) {
//         toggleRun(useDispatch, compName);
//     }
// }