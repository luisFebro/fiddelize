import { useEffect } from 'react';
import { clientAdminColl, userProfileColl } from '../../utils/storage/lStorage';
import setDataIfOnline from '../../utils/storage/setDataIfOnline';
import useRecoverSysData from './useRecoverSysData';
import { useProfile, useClientAdmin, useClientUser } from '../useRoleData';
import { useStoreState } from 'easy-peasy';
// import { showSnackbar } from '../../redux/actions/snackbarActions';
// end data
export const useRecoveryAndDataOffline = () => {
    const isUserOnline = useStoreState(state => state.authReducer.cases.isUserOnline);

    const { userId, role, userName } = useProfile();
    const { bizId, userScore, userLastScore, userPurchase } = useClientUser();
    const { bizName, bizPlan, bizCodeName, bizRegulation, maxScore, mainReward, rewardList, highestScores } = useClientAdmin();

    // data
    const userProfileNewObj = {
        _id: userId,
        role,
        name: userName,
        currScore: userScore,
        lastScore: userLastScore,
        purchaseHistory: userPurchase,
        bizId,
    }

    const clientAdminNewObj = {
        bizName,
        bizCodeName,
        bizPlan,
        maxScore,
        mainReward,
        rewardList,
        regulation: {
            text: bizRegulation && bizRegulation.text,
            updatedAt: bizRegulation && bizRegulation.updatedAt,
        },
        highestScores,
    }

    setDataIfOnline(userProfileColl, userProfileNewObj, isUserOnline);
    setDataIfOnline(clientAdminColl, clientAdminNewObj, isUserOnline);
    useRecoverSysData(role, userId, { bizId: bizId, isUserOnline });
}

/* ARCHIVES
    // const dispatch = useStoreDispatch();
    // useEffect(() => {
    //     if(isUserOnline === false) {
    //         showSnackbar(dispatch, "Modo offline ativado!", "warning", 3000);
    //     }
    // }, [isUserOnline])
*/