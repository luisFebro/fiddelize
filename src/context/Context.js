// GLOBAL VARIABLES TO SHARE DATA AND AVOID PROP-DRILLING IN COMPLEX COMP
// Use it only for specific rich props components (do not boot up with App because perf can suffer and unnecessary data can be initialized...)
// if a prop requires to pass to more than or equal to 3 diff components down the three.
// Context is primarily used when some data needs to be accessible by many components at different nesting levels. Apply it sparingly because it makes component reuse more difficult.
import { useContext as useContextMain, createContext, useReducer } from "react";

const GlobalContext = createContext();
const Context = createContext();

// n1
export const useGlobalContext = () => useContextMain(GlobalContext);
export default function useContext() {
    return useContextMain(Context);
}

// n2
export const GlobalProvider = ({ children, store }) => (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
);
export const Provider = ({ children, store }) => (
    <Context.Provider value={store}>{children}</Context.Provider>
);

// REDUCER
export function useUify(...data) {
    const [state, uify] = useReducer(...data);

    return {
        ...state,
        uify,
    };
}

export function handleAction(action = [], state) {
    const allowedTypes = Object.keys(state);

    const [type] = action;
    if (!allowedTypes.includes(type))
        throw new Error(`the action ${type.toUpperCase()} is not allowed`);

    return [...action];
}
// END REDUCER
// warning: global context should be used for init and auth data purpose and set ONLY at files like useData.js, appAccessAlgorithm (renew session) and Login.js file so data can be used in the entire project. All other contexts should be in a sub main component/project with useContext which belong to its specific comp

/* n1 create a file "useGlobal.js" in the root of the target component to store all global variables.
this file should be import to the target file and be assigned to store like:
const store = useGlobal();
return (
    <Layout>
        <Provider store={store}>
            <NewVocabStepper />
        </Provider>
    </Layout>
);
use it like: const { globalVar1, globalVar2 } = useContext();
*/

/* n2 wrap this in the root main component like:

const store = useGlobal();

return (
    <Layout>
        <Provider store={store}>
            <MainComponent />
        </Provider>
    </Layout>
);
*/
