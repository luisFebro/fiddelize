import { setRun as runThisComp } from '../redux/actions/globalActions';
import { useStoreState } from 'easy-peasy';
// it is not possible to use "useDispatch" here because it will never be declared
// in the header of a component which will break the rule of hooks.
export const setRun = (dispatch, compName) => {
    if(compName) {
        runThisComp(dispatch, compName);
    }
}

export const useRunComp = () => {
    const { run, runName, runArray } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
        runArray: state.globalReducer.cases.runArray,
    }))

    return({
        run,
        runName,
        runArray,
    });
}


// export cosnt toggleRun = compName => {
//     if(compName) {
//         toggleRun(useDispatch, compName);
//     }
// }