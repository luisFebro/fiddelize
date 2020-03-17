export * from './lStorageStore';
// You need to specify here all the collections of the project.
// This should be AN OBJECT
const collectionStore = {
    "onceChecked": {}, // this is for actions that need to be used only once in the app like introduction msgs.
    "userProfile": {},
    "clientAdmin": {},
    "appSystem": {},
};

export default function lStorage(type, options, next) {
    const { collection, property, value } = options;

    const notInCollection = !collectionStore.hasOwnProperty(collection);
    const objInCollection = JSON.parse(localStorage.getItem(collection));
    let notInProperty = true;
    if(objInCollection) {
        notInProperty = !objInCollection.hasOwnProperty(property);
    }

    // Validation
    if(!collection) throw new Error("Insert a collection's name");
    if(!(["setItem", "setItems", "getItem", "getItems", "removeItems", "removeItem"]).includes(type)) throw new Error("You need to specify the localStorage type: either setItem, setItems, getItem, getItems, removeItems (remove all items from a collection), removeItem (One specific property from a collection). Check also for typos...")
    if(!value && type === "setItem" && typeof value !== 'boolean') throw new Error("Insert a value");
    if(notInCollection && type === "getItem") throw new Error("This collection does not exists. You can not get anything...")
    // End Validation


    if(type === "setItem") {
        let result;
        if(notInCollection) throw new Error("You need to specify a new localStorage collection on utils/storage/lStorage.js file")

        if(notInProperty) {
            result = {...objInCollection, [property]: value};
        } else {
            objInCollection[property] = value;
            result = objInCollection;
        }
        localStorage.setItem(collection, JSON.stringify(result))
        return;
    }

    if(type === "setItems") {
        if(notInCollection) throw new Error("You need to specify a new localStorage collection on utils/storage/lStorage.js file")
        const isBothKeyArray = Array.isArray(property) && Array.isArray(value);

        if(!isBothKeyArray) throw new Error("If you specify either property or value as an array, then BOTH need to an array. Not one of them...")
        if(isBothKeyArray && property.length !== value.length) throw new Error("A value is missing... Both property and value key should have equal values' length")

        if(isBothKeyArray) {
            let addedObj = {};
            property.forEach((prop, ind) => {
                addedObj[prop] = value[ind];
            })
            localStorage.setItem(collection, JSON.stringify(addedObj))
            return;
        }
    }

    if(type === "getItem") {
        let valueRes = null;
        if(objInCollection) {
           valueRes = objInCollection[property];
        }

        return valueRes;
    }

    if(type === "getItems") {
        return objInCollection;
    }


    if(type === "removeItem") {
        if(notInProperty) {
            //console.warn(`Property key not found. The ${collection.toUpperCase()} collection got not ${property.toUpperCase()} property`)
            return null;
        } else {
            const objInCollection = JSON.parse(localStorage.getItem(collection));

            delete objInCollection[property];

            localStorage.setItem(collection, JSON.stringify(objInCollection));
            return;
        }
    }

    if(type === "removeItems") {
        localStorage.setItem(collection, JSON.stringify({}))
        return;
    }

    next();
}




// ENTIRE REFERENCE FOR LOCALSTORAGE FROM BOOKMANIA.
/**
 *
 * addItem to localStorage
 * @param  {Object}   item
 * @param  {Function} next [redirect to cart]
export const addItem = (item, next) => {
    let cart = [];
    if (typeof window !== "undefined") {
        // check if the localStorage got already the item
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        }
        // if not, add/push to an array
        cart.push({
            ...item,
            count: 1 // this is a new key, not included in the product model in the backend
        });

        // remove duplicates
        // build an Array from new Set and turn it back into array using Array.from
        // so that later we can re-map it
        // new set will only allow unique values in it
        // so pass the ids of each object/product
        // If the loop tries to add the same value again, it'll get ignored
        // ...with the array of ids we got on when first map() was used
        // run map() on it again and return the actual product from the cart

        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {  //n1
            return cart.find(p => p._id === id);
        });

        // add array with new item to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        next();
    }
};

export const itemTotal = () => {
    if(typeof window !== "undefined" && localStorage.getItem("cart")) {
        return JSON.parse(localStorage.getItem("cart")).length; // n2
    }
    return 0;
}

export const getCart = () => {
    if(typeof window !== "undefined" && localStorage.getItem("cart")) {
        return JSON.parse(localStorage.getItem("cart"));
    }
    return [];
}

export const updateItem = (productId, count) => {
    let cart = [];
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            // if there exists already a cart, we put in the cart variable
            cart = JSON.parse(localStorage.getItem("cart"));
        }

        // finding product and update its count key
        cart.map((product, i) => {
            if (product._id === productId) {
                cart[i].count = count;
            }
        });

        localStorage.setItem("cart", JSON.stringify(cart));
    }
};

export const removeItem = productId => {
    let cart = [];
    if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        }

        cart.map((product, i) => {
            if (product._id === productId) {
                cart.splice(i, 1);
            }
        });

        localStorage.setItem("cart", JSON.stringify(cart));
    }
    return cart;
};

export const emptyCart = next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        next();
    }
};
*/

// n1: The Array.from() method returns an Array object from any object with a length property or an iterable object.
// parameters:
/*
object  Required. The object to convert to an array
mapFunction Optional. A map function to call on each item of the array
thisValue   Optional. A value to use as this when executing the mapFunction
 */
// exemple:
/*
console.log(Array.from('foo'));
// expected output: Array ["f", "o", "o"]
console.log(Array.from([1, 2, 3], x => x + x));
// expected output: Array [2, 4, 6]
 */

// n2: if you not convert to object, then it will count which character in the format of JSON/string