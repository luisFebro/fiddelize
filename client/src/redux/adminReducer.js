import { reducer } from 'easy-peasy';
import updateKey from './helpers/updateKey';

// REDUCERS
const initialState = {
    businessInfo: {},
    services: [],
};

export const adminReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case 'LOAD_ADMIN':
                return {
                    ...state,
                    businessInfo: action.payload.businessInfo,
                }
            case 'UPDATE_BIZ_INFO':
                const obj = state.businessInfo;
                const objWithValueToUpdate = action.payload;
                updateKey(obj, objWithValueToUpdate);
                return {
                    ...state,
                }
            case 'SERVICES_READ':
                return {
                    ...state,
                    services: action.payload,
                }
            default:
                return state;
        }
    })
};
