import { useStoreState } from 'easy-peasy';
const gotToken = localStorage.getItem('token');

// tokenWhenLogin assures that user holds a valid token since gotToken
// from local storage will only be assessed by the system in the next loading time.
// The current state will be null.
// The tokenWhenLogin completes the gotToken to verify the validity of access.
export const useAuthUser = () => {
    const { tokenWhenLogin, runName } = useStoreState(state => ({
        tokenWhenLogin: state.authReducer.cases.tokenWhenLogin,
        runName: state.globalReducer.cases.runName,
    }))

    const isLogout = runName === "logout";
    const isAuthorized = !isLogout && (gotToken && !tokenWhenLogin) || (!gotToken && tokenWhenLogin) || (gotToken && tokenWhenLogin);

    return({
        isAuthUser: Boolean(isAuthorized),
        gotToken, // This is depracated.
    })
}
