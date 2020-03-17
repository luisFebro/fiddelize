import { reducer } from 'easy-peasy';
import updateKeyWithId from './helpers/updateKeyWithId';
import lStorage, { userProfileOp, clientAdminOp, needInitialStateOp } from '../utils/storage/lStorage';
// You can use only one isntance of object like 'cases' for each object.
// Check for mispellings in case of one action not being dispatched properly.
// Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED

if(lStorage("getItem", needInitialStateOp)) {
    lStorage("setItems", userProfileOp);
    lStorage("setItems", clientAdminOp);
    lStorage("setItem", { ...needInitialStateOp, value: false })
}

const userData = lStorage("getItems", userProfileOp);
const clientAdminData = lStorage("getItems", clientAdminOp);

const currUserData = {
    role: null || userData && userData.role,
    name: null || userData && userData.name,
    clientUserData: {
        bizId: null || userData && userData.bizData,
        currScore: null || userData && userData.currScore,
        cashCurrScore: null || userData && userData.lastScore,
        purchaseHistory: null || userData && userData.purchaseHistory,
    }
}

const currClientAdminData = {
    clientAdminData: {
        rewardScore:  null || clientAdminData && clientAdminData.maxScore,
        mainReward: null || clientAdminData && clientAdminData.mainReward,
        rewardList: null || clientAdminData && clientAdminData.rewardList,
        regulationTxt: null || clientAdminData && clientAdminData.regulationTxt,
    }
}

// REDUCERS
const initialState = {
    currentUser: currUserData,
    clientAdmin: currClientAdminData,
    allUsers: [],
    highestScores: [],
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
