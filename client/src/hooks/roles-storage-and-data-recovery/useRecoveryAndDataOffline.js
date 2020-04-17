// WARNING: to avoid conflict of data, it does not requires to use lStorage in other components
// Declare them all here otherwise may arise some issues while comparing online and offline data...
import { useEffect } from 'react';
import { clientAdminColl, userProfileColl, centralAdminColl } from '../../utils/storage/lStorage';
import setDataIfOnline from '../../utils/storage/setDataIfOnline';
import useRecoverSysData from './useRecoverSysData';
import {
    useProfile, useClientAdmin, useClientUser, useCentralAdmin } from '../useRoleData';
import { useStoreState } from 'easy-peasy';
import { useAppSystem } from '../useRoleData';
// import { showSnackbar } from '../../redux/actions/snackbarActions';
// end data
export const useRecoveryAndDataOffline = () => {
    const isUserOnline = useStoreState(state => state.authReducer.cases.isUserOnline);

    const clientUserValues = useClientUser();
    const profileValues = useProfile();

    let { bizId } = clientUserValues;
    const { role, _id } = profileValues;
    const { businessId } = useAppSystem;

    bizId = bizId || businessId;
    console.log("bizId", bizId);

    // data
    const centralAdminNewObj = useCentralAdmin();
    const clientAdminNewObj = useClientAdmin();
    const userProfileNewObj = { ...profileValues, ...clientUserValues }

    setDataIfOnline(userProfileColl, userProfileNewObj, isUserOnline);
    setDataIfOnline(clientAdminColl, clientAdminNewObj, isUserOnline);
    setDataIfOnline(centralAdminColl, centralAdminNewObj, isUserOnline);
    useRecoverSysData(role, _id, { bizId, isUserOnline });
}

/* ARCHIVES
    // const dispatch = useStoreDispatch();
    // useEffect(() => {
    //     if(isUserOnline === false) {
    //         showSnackbar(dispatch, "Modo offline ativado!", "warning", 3000);
    //     }
    // }, [isUserOnline])
*/