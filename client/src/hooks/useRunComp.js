import { setRun as runThisComp } from '../redux/actions/globalActions';
import { useStoreState } from 'easy-peasy';
// it is not possible to use "useDispatch" here because it will never be declared
// in the header of a component which will break the rule of hooks.
export const setRun = (dispatch, compName, options) => {
    if(compName) {
        runThisComp(dispatch, compName, options);
    }
}

export const useRunComp = () => {
    const { run, runName, runOneArray } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
        runOneArray: state.globalReducer.cases.runOneArray,
    }))

    return({
        run,
        runName,
        runOneArray,
    });
}


// export cosnt toggleRun = compName => {
//     if(compName) {
//         toggleRun(useDispatch, compName);
//     }
// }