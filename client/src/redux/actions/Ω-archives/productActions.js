// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue
import axios from 'axios';
import { tokenConfig } from './authActions';
import { setLoadingProgress, setErrorOn } from './globalActions';
import { getHeaderJson } from '../../utils/server/getHeaders';
// get an obj with all infos of a item from a specific id
export const getItem = (allProductsList, _id) => {
    const product = allProductsList.find(item => item._id === _id);
    return product;
};
//END UTILS

//CRUD PATTERN
// create product
export const addProduct = product => async (dispatch, getState) => {
    const res = await axios.post('/api/product', product, tokenConfig(getState));
    try {
        dispatch({ type: 'ADD_PRODUCT', payload: res.data });
    } catch (err) {
        setErrorOn(dispatch, err.response.data.msg);
    }
};

export const readProduct = async (dispatch, idOrDashedTitle) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = axios.get(`/api/product/${idOrDashedTitle}`, getHeaderJson)
        setLoadingProgress(dispatch, false);
        return res;
    } catch(err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
}

// keyToUpdate = { key: value }
export const updateProduct = async (dispatch, keyToUpdate, _idProduct) => {
    // Switching obj keys dynamically to update in Reducer
    const targetKey = Object.keys(keyToUpdate)[0];
    const dataToUpdate = {
        _id: _idProduct,
        [`${targetKey}`]: keyToUpdate[targetKey]
    };
    try {
        await axios.put(`/api/product/${_idProduct}`, keyToUpdate, getHeaderJson);
        console.log('==CHANGING PRODUCT==');
        dispatch({ type: 'CHANGE_PRODUCT', payload: dataToUpdate }); // dataToUpdate
    } catch (e) {
        // statements
        console.log(e);
    }
};

export const deleteProduct = async (dispatch, _idProduct) => {
    try {
        await axios.delete(`/api/product/${_idProduct}`, getHeaderJson);
        console.log('==PRODUCT DELETED==');
        dispatch({ type: 'DELETE_PRODUCT', payload: _idProduct });
        // update
        getAllProducts(dispatch);
    } catch (err) {
        setErrorOn(dispatch, err.response.data.msg);
    }
};
//END CRUD PATTERN


// LISTS
export const getAllProducts = async dispatch => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.get('/api/product/list/all');
        console.log('==GOT ALL PRODUCTS==');
        dispatch({ type: 'GET_ALL_PRODUCTS', payload: res.data });
        setLoadingProgress(dispatch, false);
    } catch (err) {
        setLoadingProgress(dispatch, false);
        console.log('getAllProductsError', err);
    }
};

export const loadRelatedProducts = async (dispatch, productData) => {
    try {
        const { id, limit } = productData;
        return await axios.get(`/api/product/list/related/${id}?limit=${limit}`, getHeaderJson);
    } catch(err) {
        return err.response;
    }
}

export const loadFavoriteProducts = async (userId) => {
    try {
        return await axios.get(`/api/product/${userId}/list/favorite`, getHeaderJson)
    } catch(err) {
        return err.response;
    }
}
// END LISTS



export const addToCart = id => {
    const { products, cart } = this.state;
    let tempProducts = [...products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(
        () => {
            return {
                products: tempProducts,
                cart: [...cart, product]
            };
        },
        () => {
            this.addTotals();
            this.countItems();
        }
    );
};

// NOTE:
// n1 : Every Effect Hook comes with a clean up function which runs when a component unmounts.
// The clean up function is the one function returned from the hook.
// In our case, we use a boolean flag called didCancel to let our data fetching logic know about the state (mounted/unmounted) of the component.
// If the component did unmount, the flag should be set to true which results in preventing to set the component state after the data fetching has been asynchronously resolved eventually.
