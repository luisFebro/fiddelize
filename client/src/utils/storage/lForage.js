// FOT STATIC ASSETS AND OFFLINE IMAGES
import localforage from 'localforage';
import gotArrayThisItem from '../../utils/arrays/gotArrayThisItem';
// import lStorage from '../../utils/storage/lStorage';
// export * from './lForageStore';

export const setVariables = () => {
    return null;
}

// convert the blob (image) into a data-url (a base64 string) and set that as the src for your image element.
// createInstance and config is required especially if you are reading or deleting a file. Requires the right collection to process.
export const setImage = (collection, dataKey, imageUrlValue) => {
    const store = localforage.createInstance({ name: `fiddelize-${collection}` }) // n2
    store.config({ storeName: collection }); // n3 dataStore
    // This error condition is commented out because there is a need for dinamic name insertion.
    // if(!gotArrayThisItem(collectionStore[collection], dataKey)) throw new Error("Collection or dataKey not found. You should declare a new collection in lForageStore");
    if(!imageUrlValue) console.log("WARNING: imageURL param is missing...")

    return fetch(imageUrlValue)
    .then(response => response.blob()) // n4 response e.g
    .then(blob => convertBlobIntoDataUrlAndSet(collection, dataKey, blob, store))
    .catch(console.log.bind(console))
}

export const readImage = (collection, dataKey) => {
    const store = localforage.createInstance({ name: `fiddelize-${collection}` }) // n2
    store.config({ storeName: collection }); // n3 dataStore
    // if(!gotArrayThisItem(collectionStore[collection], dataKey)) throw new Error("Collection or dataKey not found. You should declare a new collection in lForageStore");

    return store.getItem(dataKey)
    .then(function(res) { return res })
    .catch(err => false)
}

export const deleteImage = (collection, dataKey) => {
    const store = localforage.createInstance({ name: `fiddelize-${collection}` }) // n2
    store.config({ storeName: collection }); // n3 dataStore

    return store.getItem(dataKey)
    .then(generatedUrl => {
        if(generatedUrl) {
            store.removeItem(dataKey)
            .then(deletedImage => {
                console.log(`The image ${dataKey.toUpperCase()} was deleted successfully.`)
            }).catch(err => console.log("There was an issue while deleting your image. Details: " + err))
        } else { console.log("No image found in the IndexedDB to be deleted") }
    })
    .catch(err => false)
}


const convertBlobIntoDataUrlAndSet = (collection, keyToSet, blob, store) => { // n1
    let mySrc;

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return reader.onloadend = function() {
        mySrc = reader.result;
        // lStorage("setItems", {collection: 'images', newObj: { [keyToSet]: mySrc } })
        return store.setItem(keyToSet, mySrc)
        // .then(generatedUrl => {
        //     const doc = document.querySelector(`.${keyToSet}`);
        //     if(doc) {
        //           doc.forEach(elemFound => elemFound.src = generatedUrl);
        //     }
        //     return generatedUrl;
        // })
    }
}

// export default function getImages(key, imageUrl) {
    // // The same code, but using ES6 Promises.
    // localforage.iterate(function(value, key, iterationNumber) {
    //     // Resulting key/value pair -- this callback
    //     // will be executed for every item in the
    //     // database.
    //     console.log([key, value]);
    // }).then(function() {
    //     console.log('Iteration has completed');
    // }).catch(function(err) {
    //     // This code runs if there were any errors
    //     console.log(err);
    // });

    // // Exit the iteration early:
    // localforage.iterate(function(value, key, iterationNumber) {
    //     if (iterationNumber < 3) {
    //         console.log([key, value]);
    //     } else {
    //         return [key, value];
    //     }
    // }).then(function(result) {
    //     console.log('Iteration has completed, last iterated pair:');
    //     console.log(result);
    // }).catch(function(err) {
    //     // This code runs if there were any errors
    //     console.log(err);
    // });
// }

/* COMMENTS
n1:
convert the blob (image) into a data-url (a base64 string) and set that as the src for your image element.
https://stackoverflow.com/questions/51019467/convert-blob-to-image-url-and-use-in-image-src-to-display-image

n2:
name
The name of the database. May appear during storage limit prompts. Useful to use the name of your app here. In localStorage, this is used as a key prefix for all keys stored in localStorage.
Default: 'localforage'

n3:
Must be alphanumeric, with underscores. Any non-alphanumeric characters will be converted to underscores.

n4:
body: (...)
bodyUsed: true
headers: Headers
__proto__: Headers
ok: true
redirected: false
status: 200
statusText: "OK"
type: "basic"
url: "http://localhost:3000/img/icons/podium.png"
*/

/* ARCHIVES
// const req = new XMLHttpRequest();
// req.open('GET', imageUrl, true);
// req.responseType = 'arraybuffer';

// req.addEventListener('readystatechange', function() {
//     if (req.readyState === 4) { // readyState DONE
//         localforage.setItem('logo', req.response)
//         .then(logo => {
//             alert("logo", logo); // This will be a valid blob URI for an <img> tag.
//             var blob = new Blob([logo]);
//             alert("blob", blob);
//             var imageURI = window.URL.createObjectURL(blob);
//         }).catch(function(err) {
//           // This code runs if there were any errors
//           console.log(err);
//         });
//     }
// });
*/