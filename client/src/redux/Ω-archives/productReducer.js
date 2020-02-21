import { reducer } from 'easy-peasy';
import updateKeyWithId from './helpers/updateKeyWithId'
// You can use only one isntance of object like 'cases' for each object.
// Check for mispellings in case of one action not being dispatched properly.
// Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED


// REDUCERS
const initialState = {
    allProductsList: []
};

export const productReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            // CRUD PATTERN
            case 'ADD_PRODUCT':
                return {
                    ...state,
                    allProductsList: [action.payload, ...state.allProductsList]
                };
            case 'GET_ALL_PRODUCTS':
                return {
                    ...state,
                    allProductsList: action.payload //n1
                };
            case 'CHANGE_PRODUCT':
                updateKeyWithId(state.allProductsList, action.payload);
                // after updating, return the whole state.
                return {
                    ...state
                };
            case 'DELETE_PRODUCT':
                return {
                    ...state,
                    allProductsList: state.allProductsList.filter(product => product._id !== action.payload._id)
                };
            // END CRUD PATTERN
            case 'DETAIL_PRODUCT':
                return {
                    ...state
                };
            default:
                return state;
        }
    })
};

// n1:
// data fetched is like this:
// company: "diversos"
// count: 0
// description: "lingeries"
// image: "img/products/calcinhas-tematicas-gostosa-delicia-pirigueti.jpg"
// inCart: false
// info: "calcinhas na cor preta com temáticas gostosa delicia, pirigueti"
// isAddedToFav: false
// price: 40
// registerDate: "Outubro 12º 2019, 9:22:04 pm"
// systemDate: "2019-10-13T01:27:40.597Z"
// title: "calcinhas temáticas gostosa delicia pirigueti"
// total: 0
// __v: 0
// _id: "5da27d8ca83d231dc4
