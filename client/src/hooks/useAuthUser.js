import { useStoreState } from 'easy-peasy';
const gotToken = localStorage.getItem('token');

// tokenWhenLogin assures that user holds a valid token since gotToken
// from local storage will only be assessed by the system in the next loading time.
// The current state will be null.
export const useAuthUser = () => {
    const { tokenWhenLogin } = useStoreState(state => ({
        tokenWhenLogin: state.authReducer.cases.tokenWhenLogin,
    }))

    const isAuthorized = (gotToken && !tokenWhenLogin) || (!gotToken && tokenWhenLogin);

    return({
        isAuthUser: Boolean(isAuthorized),
        gotToken,
    })
}
