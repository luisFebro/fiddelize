import { reducer } from 'easy-peasy';
// About: Reusable with many components, especially for true-false states
//Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED

// REDUCERS
const initialState = {
    isLoading: false,
    isLinearPLoading: false,
    isCustomLoading: false,
    isCustom2Loading: false,
    errorMsg: null,
    currentItemFound: null,
    run: false,
    runName: '',
};

export const globalReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            // Objs
            case 'CURRENT_ITEM_FOUND':
                return {
                    ...state,
                    currentItemFound: action.payload
                };
            case 'RUN_SET': {
                return {
                    ...state,
                    run: !state.run,
                    runName: action.payload,
                }
            }
            //Show
            case 'SHOW_LOADING':
                return {
                    ...state,
                    isLoading: true
                };
            case 'SHOW_ERROR':
                return {
                    ...state,
                    errorMsg: action.payload
                };
            case 'LOADING_PROGRESS_TOGGLED':
                return {
                    ...state,
                    isLinearPLoading: action.payload
                }
            case 'CUSTOM_LOADING_TOGGLED':
                return {
                    ...state,
                    isCustomLoading: action.payload
                }
            case 'CUSTOM_LOADING_2_TOGGLED':
                return {
                    ...state,
                    isCustom2Loading: action.payload
                }
            //Clear
            case 'CLEAR_LOADING':
                return {
                    ...state,
                    isLoading: false
                };
            case 'CLEAR_ERROR':
                return {
                    ...state,
                    errorMsg: ''
                };
            default:
                return state;
        }
    })
};
