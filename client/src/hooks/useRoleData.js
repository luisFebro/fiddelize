import { useStoreState } from 'easy-peasy';

export const useProfile = () => {
    const currentUser = useStoreState(state => state.userReducer.cases.currentUser);

    const userId = currentUser && currentUser._id;
    const userName = currentUser && currentUser.name;
    const role = currentUser && currentUser.role;

    return({
        role,
        userId,
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
    const { clientAdmin } = useStoreState(state => ({
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
    }))

    const maxScore = clientAdmin && clientAdmin.rewardScore;
    const bizCodeName = clientAdmin && clientAdmin.bizCodeName;
    const mainReward = clientAdmin && clientAdmin.mainReward;

    return({
        maxScore,
        bizCodeName,
        mainReward,
    });
}