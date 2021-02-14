import { useStoreState } from "easy-peasy";
import { setVariable as runThisVariable } from "../redux/actions/globalActions";
// it is not possible to use "useDispatch" here because it will never be declared
// in the header of a component which will break the rule of hooks.
export const setVariable = (dispatch, keyValueObj) => {
    runThisVariable(dispatch, keyValueObj);
};

export default function useVariable(key = "someTargetVariable") {
    const { variables } = useStoreState((state) => ({
        variables: state.globalReducer.cases.variables,
    }));

    const variableValue = variables[key];

    return variableValue;
}
