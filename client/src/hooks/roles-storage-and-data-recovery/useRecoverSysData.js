import { useEffect } from 'react';
import lStorage from '../../utils/storage/lStorage';
// import { useClientUser } from '../hooks/useRoleData';
import useDispatch, { showSnackbar } from '../useDispatch';
import { updateUser } from '../../redux/actions/userActions';
import { readClientAdmin as readCliAdmin } from '../../redux/actions/userActions';

const collection = { collection: "appSystem" };
const appSystem = lStorage("getItems", collection);
const bizSysId = appSystem && appSystem.businessId;

const roleDownloaded = appSystem && appSystem.roleWhichDownloaded;

const needUpdateSys = !bizSysId || !roleDownloaded;

export default function useRecoverSysData(role, userId, opts = {}) {
    const { bizId } = opts;

    useEffect(() => {
        // "0" and "client" are the initial <defau></defau>lt values...
        if(bizSysId === "0") {
            if(role === "cliente") {
                const objToSend = { "clientUserData.bizId": bizSysId }
                updateUser(useDispatch, objToSend, userId)
                .then(res => {
                    if(res.status !== 200) return showSnackbar(useDispatch, res.data.msg, 'error')
                    console.log("User was updated in the useUpdateSysData")
                })
            }
        }

        if(needUpdateSys) {
            let whichBizId;

            if(role === "cliente") { whichBizId = bizId; }
            if(role === "cliente-admin") { whichBizId = userId; } // if clientAdmin, userId === bizId.

            const updatedValues = {roleWhichDownloaded: role, businessId: whichBizId };
            lStorage("setItems", {...collection, newObj: updatedValues})
        }
    }, [userId, role, bizSysId, needUpdateSys])
}

export const readClientAdmin = (dispatch, userId) => {
    if(appSystem) {
        readCliAdmin(dispatch, bizSysId);
    } else {
        readCliAdmin(dispatch, userId); //  if clientAdmin, userId === bizId.
    }
}