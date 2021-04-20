import { useStoreState } from "easy-peasy";
import { setRun as runThisComp } from "../redux/actions/globalActions";

export const setRun = (dispatch, compName, options) => {
    if (compName) {
        runThisComp(dispatch, compName, options);
    }
};

export const useRunComp = () => {
    const { run, runName, runName2, runOneArray } = useStoreState((state) => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
        runName2: state.globalReducer.cases.runName2,
        runOneArray: state.globalReducer.cases.runOneArray,
    }));

    return {
        run,
        runName,
        runName2,
        runOneArray,
    };
};
