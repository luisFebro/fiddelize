import { useStoreState } from 'easy-peasy';
import lStorage, { appSystemColl, userProfileColl } from '../utils/storage/lStorage';

const sys = lStorage("getItems", appSystemColl);
const systemRole = sys && sys.roleWhichDownloaded;
const systemBizId = sys && sys.businessId;

// appSystem will be depracated since it is not reliable with starting valueswith nulll from local storage...
// useAppSystem is compelte..
export const appSystem = {
    roleWhichDownloaded: systemRole,
    businessId: systemBizId,
}

export const useAppSystem = () => {
    const { clientUser, profile, role } = useStoreState(state => ({
        role: state.userReducer.cases.currentUser.role,
        clientUser: state.userReducer.cases.currentUser.clientUserData,
        profile: state.userReducer.cases.currentUser,
    }));
    const clientUserBizId = clientUser && clientUser.bizId;
    const clientAdminBizId = profile && profile._id;

    const onlineBizId = role === "cliente-admin" ? clientAdminBizId : clientUserBizId;

    return({
        roleWhichDownloaded: systemRole || role,
        businessId: systemBizId || onlineBizId,
    });
}

export const useProfile = () => {
    const currentUser = useStoreState(state => state.userReducer.cases.currentUser);

    const userId = currentUser && currentUser._id;
    const userName = currentUser && currentUser.name && currentUser.name.cap();
    const role = currentUser && currentUser.role;

    return({
        userId,
        role,
        userName,
    })
};

export const useClientUser = () => {
    const { clientUser } = useStoreState(state => ({
        clientUser: state.userReducer.cases.currentUser.clientUserData,
    }));

    const bizId = clientUser && clientUser.bizId;
    const userScore = clientUser && clientUser.currScore;
    const userLastScore = clientUser && clientUser.cashCurrScore;
    const userPurchase = clientUser && clientUser.purchase;

    return({
        bizId,
        userScore,
        userLastScore,
        userPurchase,
    });
}

export const useClientAdmin = () => {
    const { clientAdmin, highestScores } = useStoreState(state => ({
        clientAdmin: state.userReducer.cases.clientAdmin,
        highestScores: state.userReducer.cases.highestScores,
    }))


    const maxScore = clientAdmin && clientAdmin.rewardScore;
    const mainReward = clientAdmin &&  clientAdmin.mainReward && clientAdmin.mainReward.cap();
    const rewardList = ["giftA", "giftB"];
    const bizName = clientAdmin && clientAdmin.bizName && clientAdmin.bizName.cap();
    const bizCodeName = clientAdmin && clientAdmin.bizCodeName;
    const bizPlan = clientAdmin && clientAdmin.bizPlan;
    const bizRegulation = clientAdmin && clientAdmin.regulation;

    return({
        bizName,
        bizPlan,
        bizCodeName,
        bizRegulation,
        highestScores,
        maxScore,
        mainReward,
        rewardList,
    });
}