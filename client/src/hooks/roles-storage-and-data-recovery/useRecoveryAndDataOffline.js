import { clientAdminColl, userProfileColl } from '../../utils/storage/lStorage';
import setDataIfOnline from '../../utils/storage/setDataIfOnline';
import useRecoverSysData from './useRecoverSysData';
import { useProfile, useClientAdmin, useClientUser } from '../useRoleData';


// end data
export const useRecoveryAndDataOffline = () => {
    const { userId, role, userName } = useProfile();
    const { bizId, userScore, userLastScore, userPurchase } = useClientUser(); // , userPurchase
    const { bizName, bizPlan, bizCodeName, bizRegulation, maxScore, mainReward } = useClientAdmin();

    // data
    const userProfileNewObj = {
        role,
        _id: userId,
        name: userName,
        currScore: userScore,
        lastScore: userLastScore,
        purchase: userPurchase,
    }

    const clientAdminNewObj = {
        bizName,
        bizPlan,
        bizCodeName,
        regulation: {
            text: bizRegulation.text,
            updatedAt: bizRegulation.updatedAt,
        },
        maxScore,
        mainReward
    }

    setDataIfOnline(userProfileColl, userProfileNewObj);
    setDataIfOnline(clientAdminColl, clientAdminNewObj);
    useRecoverSysData(role, userId, { bizId: bizId });
}