// WARNING: to avoid conflict of data, it does not requires to use lStorage in other components
// Declare them all here otherwise may arise some issues while comparing online and offline data...
import { useStoreState } from "easy-peasy";
// import useRecoverSysData from "./useRecoverSysData";

// end data

export const useRecoveryAndDataOffline = () => {
    const { runName } = useStoreState((state) => ({
        runName: state.globalReducer.cases.runName,
    }));

    const didUserLogout = runName === "logout";

    // useRecoverSysData(role, userId, { bizId, isUserOnline, didUserLogout });
};
