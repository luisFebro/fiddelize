import { reducer } from 'easy-peasy';
import updateKeyWithId from './helpers/updateKeyWithId';
import lStorage, { userProfileColl, clientAdminColl, centralAdminColl } from '../utils/storage/lStorage';

const userData = lStorage("getItems", userProfileColl); // n1
const clientAdminData = lStorage("getItems", clientAdminColl);
const centralAdminData = lStorage("getItems", centralAdminColl);

const currUserData = {
    _id: userData && userData._id,
    role: userData && userData.role,
    name: userData && userData.name,
    clientUserData: {
        bizId: userData && userData.bizId,
        currScore: userData && userData.currScore,
        cashCurrScore: userData && userData.lastScore,
        purchaseHistory: userData && userData.purchaseHistory,
        totalGeneralScore: userData && userData.totalGeneralScore,
        totalPurchasePrize: userData && userData.totalPurchasePrize,
    },
    updatedAt: userData && userData.updatedAt,
    createdAt: userData && userData.updatedAt,
}

const currClientAdminData = {
    bizName: clientAdminData && clientAdminData.bizName,
    bizCodeName: clientAdminData && clientAdminData.bizCodeName,
    bizPlan: clientAdminData && clientAdminData.bizPlan,
    bizWhatsapp: clientAdminData && clientAdminData.bizWhatsapp,
    rewardScore: clientAdminData && clientAdminData.maxScore,
    mainReward: clientAdminData && clientAdminData.mainReward,
    rewardList: clientAdminData && clientAdminData.rewardList,
    regulation: {
        text: clientAdminData && clientAdminData.regulation.text,
        updatedAt: clientAdminData && clientAdminData.regulation.updatedAt,
    },
    rewardDeadline: clientAdminData && clientAdminData.rewardDeadline,
    totalClientUserScores: clientAdminData && clientAdminData.totalClientUserScores,
    totalClientUsers: clientAdminData && clientAdminData.totalClientUsers,
}

const currCentralAdminData = {
    limitFreePlanNewUsers: centralAdminData && centralAdminData.limitFreePlanNewUsers,
    mainSalesWhatsapp: centralAdminData && centralAdminData.mainSalesWhatsapp,
    mainTechWhatsapp: centralAdminData && centralAdminData.mainTechWhatsapp,
}

const highestScoreData = clientAdminData && clientAdminData.highestScores;

// REDUCERS
const initialState = {
    centralAdmin: currCentralAdminData,
    clientAdmin: currClientAdminData,
    currentUser: currUserData,
    highestScores: highestScoreData,
    allUsers: [],
};

export const userReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case 'CENTRAL_ADMIN_READ':
                return {
                    ...state,
                    centralAdmin: action.payload,
                };
            case 'CLIENT_ADMIN_READ':
                return {
                    ...state,
                    clientAdmin: action.payload,
                };
            case 'USER_READ':
                return {
                    ...state,
                    currentUser: action.payload,
                };
            case 'USER_DELETED':
                return {
                    ...state,
                    allUsers: state.allUsers.filter(user => user._id !== action.payload)
                };
            case 'USER_UPDATED':
                action.payload && updateKeyWithId(state.allUsers, action.payload);
                return {
                    ...state
                };
            case 'USER_READ_LIST':
                return {
                    ...state,
                    allUsers: action.payload,
                };
            case 'HIGHEST_SCORES_READ':
                let payload;
                action.payload && action.payload.length === 0
                ? payload = [{name: "nome1"}, {name: "nome2"}, {name: "nome3"}]
                : payload = action.payload
                return {
                    ...state,
                    highestScores: payload,
                };
            // CUSTOMIZED DATA HANDLING from social network
            case 'USER_GOOGLE_DATA':
                return {
                    ...state,
                    currentUser: {
                        _id: action.payload.tokenId,
                        name: action.payload.profileObj.familyName,
                        email: action.payload.profileObj.email,
                        picture: action.payload.profileObj.imageUrl
                    }
                }
            case 'USER_FACEBOOK_DATA':
                return {
                    ...state,
                    currentUser: {
                        _id: action.payload.accessToken,
                        name: action.payload.givenName,
                        email: action.payload.email,
                        picture: action.payload.picture.data.url
                    }
                }
            case 'USER_CLEARED':
                lStorage("removeItem", {collection: 'onceChecked', property: 'setInitialState'})
                // lStorage("removeCol", {collection: 'clientAdmin'}) // THis collection is not being removed..
                // lStorage("removeCol", {collection: 'userProfile'})

                return {
                    ...state,
                    currentUser: {},
                }
            default:
                return state;
        }
    })
};

/* COMMENTS
n1: this new way actually just need the oollection's name only...
*/
