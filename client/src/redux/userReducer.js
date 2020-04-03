import { reducer } from 'easy-peasy';
import updateKeyWithId from './helpers/updateKeyWithId';
import lStorage, { userProfileOp, clientAdminOp, setInitialStateOp } from '../utils/storage/lStorage';

if(!lStorage("getItem", setInitialStateOp)) {
    lStorage("setItemsByArray", userProfileOp);
    lStorage("setItemsByArray", clientAdminOp);
    lStorage("setItem", { ...setInitialStateOp, value: true })
}

const userData = lStorage("getItems", userProfileOp);
const clientAdminData = lStorage("getItems", clientAdminOp);

const currUserData = {
    _id: userData && userData._id,
    role: userData && userData.role,
    name: userData && userData.name,
    clientUserData: {
        bizId: userData && userData.bizId,
        currScore: userData && userData.currScore,
        cashCurrScore: userData && userData.lastScore,
        purchase: userData && userData.purchase,
    }
}

// This data is read in the authAction and requires the valid bizId, otherwise default values will be set...lStorage
// if(appSystem) { readClientAdmin(dispatch, appSystem.businessId); }
const currClientAdminData = {
    bizName: clientAdminData && clientAdminData.bizName,
    bizCodeName: clientAdminData && clientAdminData.bizCodeName,
    bizPlan: clientAdminData && clientAdminData.bizPlan,
    rewardScore: clientAdminData && clientAdminData.maxScore,
    mainReward: clientAdminData && clientAdminData.mainReward,
    rewardList: clientAdminData && clientAdminData.rewardList,
    regulation: {
        text: clientAdminData && clientAdminData.regulation.text,
        updatedAt: clientAdminData && clientAdminData.regulation.updatedAt,
    },
}

const highestScoreData = clientAdminData && clientAdminData.highestScores;

// REDUCERS
const initialState = {
    currentUser: currUserData,
    clientAdmin: currClientAdminData,
    highestScores: highestScoreData,
    allUsers: [],
};

export const userReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case 'USER_READ':
                return {
                    ...state,
                    currentUser: action.payload,
                };
            case 'CLIENT_ADMIN_READ':
                return {
                    ...state,
                    clientAdmin: action.payload,
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
                return {
                    ...state,
                    highestScores: action.payload,
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
                lStorage("removeCol", {collection: 'userProfile'})

                return {
                    ...state,
                    currentUser: {}
                }
            default:
                return state;
        }
    })
};

// n1:
