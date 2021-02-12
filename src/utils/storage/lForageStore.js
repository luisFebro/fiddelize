import { readImage, setImage } from './lForage';
import { CLIENT_URL } from '../../config/clientUrl';

// requires declare className to the img.
// The same name as the key. Priorly it was an ID, but there were issues when more then one src is need
function handleStorage(url, options = {}) {

    const {
        coll,
        key,
        isFromInternet = false,
        needSelector = true,
    } = options;

    const localUrl = `${CLIENT_URL}${url}`;
    const urlPath = isFromInternet ? url : localUrl;

    return readImage(coll, key).then(generatedUrl => { // LESSON: promises can not return an async value at all. Use methods like attribute to src, setData to get the value.
        if(!generatedUrl) {
            return setImage(coll, key, urlPath)
            .then(res => {
                console.log(`NEW IMG SET TO: Coll: ${coll}, Key: ${key}`)
                return urlPath;
            })
            .catch(err => console.log(err))
        } else {
            return generatedUrl;
        }
    })
}

export { handleStorage }


/*
ARCHIVES
function findElemAndSet(query, value,  opts = {}) {
    let { type } = opts;

    if(!type) { type = 'single'; }
    // if(type !== "single" || type !== "multi") throw new Error("Invalid type.");

    const setSingle = () => {
        const doc = document.querySelector(`.${query}`);
        if(doc) { doc.src = value; }
    }

    const setMulti = () => {
        const doc = document.querySelectorAll(`.${query}`);
        if(doc) {
            doc.forEach(elemFound => elemFound.src = value);
        }
    }

    type === 'single'
    ? setSingle()
    : setMulti()

}
 */