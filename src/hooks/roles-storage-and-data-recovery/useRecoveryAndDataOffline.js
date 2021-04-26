// WARNING: to avoid conflict of data, it does not requires to use lStorage in other components
// Declare them all here otherwise may arise some issues while comparing online and offline data...
import { useStoreState } from "easy-peasy";
import lStorage, {
    clientAdminColl,
    userProfileColl,
} from "../../utils/storage/lStorage";
import setDataIfOnline from "../../utils/storage/setDataIfOnline";
import useRecoverSysData from "./useRecoverSysData";
import isOffline from "../../utils/server/isOffline";
import {
    useProfile,
    useClientAdmin,
    useClientUser,
    useAppSystem,
} from "../useRoleData";

const collection = { collection: "appSystem" };
const appSystem = lStorage("getItems", collection);
const bizSysId = appSystem && appSystem.businessId;
// end data
const isUserOnline = !isOffline();

export const useRecoveryAndDataOffline = () => {
    const { runName } = useStoreState((state) => ({
        runName: state.globalReducer.cases.runName,
    }));

    const didUserLogout = runName === "logout";

    const clientUserValues = useClientUser();
    const profileValues = useProfile();

    let { bizId } = clientUserValues;
    const { role, _id } = profileValues;
    const { businessId } = useAppSystem();

    bizId = bizSysId || businessId || bizId; // businessId and bizId returns "0" when user is in the download page...

    // data
    const clientAdminNewObj = useClientAdmin();
    const userProfileNewObj = { ...profileValues, ...clientUserValues };

    setDataIfOnline(userProfileColl, userProfileNewObj, isUserOnline);
    setDataIfOnline(clientAdminColl, clientAdminNewObj, isUserOnline);
    useRecoverSysData(role, _id, { bizId, isUserOnline, didUserLogout });
};
