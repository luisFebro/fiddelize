import { reducer } from 'easy-peasy';
import updateKeyWithId from './helpers/updateKeyWithId';
// You can use only one isntance of object like 'cases' for each object.
// Check for mispellings in case of one action not being dispatched properly.
// Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED

// REDUCERS
const initialState = {
    currentUser: {},
    allUsers: [],
    highestScores: [],
};

export const userReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case 'USER_READ':
                //Check if user have coupons (If so, the maskot with discount will not appear when user log in)
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
