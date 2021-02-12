import { reducer } from 'easy-peasy';
// actions are used with the usestoredispatch hook inside the wanting functional component
// You can use only one isntance of object like 'cases' for each object.
//Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED

// REDUCERS
const initialState = {
    allStaffBookings: [],
};

export const staffBookingReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case 'STAFF_BOOKING_READ':
                return {
                    ...state,
                   allStaffBookings: action.payload.docs,
                };
            case 'STAFF_BOOKING_READ_MORE':
                return {
                   ...state,
                   allStaffBookings: [...state.allStaffBookings, ...action.payload.docs]
                };
            default:
                return state;
        }
    })
};
