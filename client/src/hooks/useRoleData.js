import { useStoreState } from 'easy-peasy';

export const useClientUser = () => {
    let { clientAdmin } = useStoreState(state => ({
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
    }))
}

export const useClientAdmin = () => {
    let { clientAdmin } = useStoreState(state => ({
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
    }))

    let maxScore = clientAdmin && clientAdmin.rewardScore;
    let bizCodeName = clientAdmin && clientAdmin.bizCodeName;

    return({
        maxScore,
        bizCodeName,
    });
}