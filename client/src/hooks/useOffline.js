import { useEffect } from "react";
import { setUserOnline } from "../redux/actions/authActions";
import isOffline from "../utils/server/isOffline";
import { useStoreState, useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../redux/actions/snackbarActions";
import { setVar, removeVar, getVar } from "../hooks/storage/useVar";
import getFirstName from "../utils/string/getFirstName";

const isConexionOff = isOffline();

export default function useOffline() {
    const { isOnline, name } = useStoreState((state) => ({
        name: state.userReducer.cases.currentUser.name,
        isOnline: state.authReducer.cases.isUserOnline,
    }));

    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (isConexionOff) {
            setUserOnline(dispatch, false);
            getVar("offlineApp").then((res) => {
                !res && showSnackbar(dispatch, "Modo Offline Ativado!");
            });
            setVar({ offlineApp: true });
        } else {
            getVar("offlineApp")
                .then((res) => {
                    setUserOnline(dispatch, true);

                    if (res) {
                        removeVar("offlineApp");
                        showSnackbar(
                            dispatch,
                            `Legal!<br />A internet voltou, ${getFirstName(
                                name
                            )}!`,
                            "success",
                            6500
                        );
                    }
                })
                .catch((e) =>
                    console.log("smg wrong with offlineApp. Details: " + e)
                );
        }
        // eslint-disable-next-line
    }, [isConexionOff]);

    return { isOffline: !isOnline };
}
