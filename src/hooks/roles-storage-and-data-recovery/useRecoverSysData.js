import { useEffect } from "react";
import lStorage from "../../utils/storage/lStorage";
// import { useClientUser } from '../hooks/useRoleData';

const collection = { collection: "appSystem" };
const appSystem = lStorage("getItems", collection);
const bizSysId = appSystem && appSystem.businessId;

const roleDownloaded = appSystem && appSystem.roleWhichDownloaded;

const needUpdateSys = !roleDownloaded; // !bizSysId ||

export default function useRecoverSysData(role, userId, opts = {}) {
    const { bizId, isUserOnline, didUserLogout } = opts;

    useEffect(() => {
        if (didUserLogout) return;

        if (needUpdateSys || isUserOnline) {
            let whichBizId;

            if (role === "cliente") {
                whichBizId = bizId;
            }
            if (role === "cliente-admin") {
                whichBizId = userId;
            } // if clientAdmin, userId === bizId.

            const updatedValues = {
                roleWhichDownloaded: role,
                businessId: whichBizId,
            };
            lStorage("setItems", { ...collection, newObj: updatedValues });
        }
    }, [userId, role, bizSysId, needUpdateSys, isUserOnline, didUserLogout]);
}
