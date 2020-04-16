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
        roleWhichDownloaded: role || systemRole, // change priority for online both role and onlineBizId to make sure http requests are updated to current bizId, not the prior account.
        businessId: onlineBizId || systemBizId,
    });
}

export const useCentralAdmin = () => {
    const centralAdmin = useStoreState(state => state.userReducer.cases.centralAdmin);

    return centralAdmin;
};

export const useProfile = () => {
    const currentUser = useStoreState(state => state.userReducer.cases.currentUser);

    const _id = currentUser && currentUser._id;
    const role = currentUser && currentUser.role;
    const name = currentUser && currentUser.name && currentUser.name.cap();
    const updatedAt = currentUser && currentUser.updatedAt;
    const createdAt = currentUser && currentUser.createdAt;

    return ({
        _id,
        role,
        name,
        updatedAt,
        createdAt,
    });
};

export const useClientUser = () => {
    const { clientUser } = useStoreState(state => ({
        clientUser: state.userReducer.cases.currentUser.clientUserData,
    }));

    const bizId = clientUser && clientUser.bizId;
    const currScore = clientUser && clientUser.currScore;
    const lastScore = clientUser && clientUser.cashCurrScore;
    const purchaseHistory = clientUser && clientUser.purchaseHistory;
    const totalGeneralScore = clientUser && clientUser.totalGeneralScore;
    const totalPurchasePrize = clientUser && clientUser.totalPurchasePrize;

    return({
        currScore,
        lastScore,
        purchaseHistory,
        bizId,
        totalGeneralScore,
        totalPurchasePrize,
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
    const bizWhatsapp = clientAdmin && clientAdmin.bizWhatsapp;
    const regulation = clientAdmin && clientAdmin.regulation;
    const rewardDeadline = clientAdmin && clientAdmin.rewardDeadline;

    return({
        bizName,
        bizCodeName,
        bizPlan,
        bizWhatsapp,
        maxScore,
        mainReward,
        rewardList,
        regulation,
        highestScores,
        rewardDeadline,
    });
}