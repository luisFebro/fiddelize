import { readImage, setImage } from './lForage';
import { CLIENT_URL } from '../../config/clientUrl';
import ImgLoader from '../../components/ImgLoader';

// USE: import imgLib, { ImgLoader } from '../../../utils/storage/lForageStore';
/*
e.g
the width and height should be number and if there is not one of them,
just write an empty string ("")
<ImgLoader
    id="dash_podium"
    width={300}
    height={250}
    className="shadow-elevation-black"
/>
 */
// dataKey syntax: location_description
// Rules: it should not fetch multiple images from one single instance like prior convert_any_illustration. This duplicates worngly images. Each image should have its own instance.
const getOptions = (coll, key, isFromInternet, onlySet, selectorType) => ({
    coll,
    key,
    isFromInternet,
    onlySet,
    selectorType,
})

const imgLib = {
    get app_fiddelize_logo() { return handleStorage(`/img/official-logo-name.png`, getOptions("logos", "app_fiddelize_logo", false, true)) },
    app_biz_logo: url => handleStorage(url, getOptions("logos", "app_biz_logo", true)),
    // Custom Icons
    get dash_podium() { return handleStorage(`/img/icons/podium.png`, getOptions("icons", "dash_podium")) },
    // Shapes - check for multiple request found after inserting the first svg shape...
    get dash_title_shape() { return handleStorage(`/img/shapes/blob-dashboard-header.svg`, getOptions("shapes", "dash_title_shape", null, null, "multi")) },
    get app_start_shape_default() { return handleStorage(`/img/shapes/blob-app-start--default.svg`, getOptions("shapes", "app_start_shape_default")) },
    get app_start_shape_pink() { return handleStorage(`/img/shapes/blob-app-start--pink.svg`, getOptions("shapes", "app_start_shape_pink")) },
    get app_start_shape_purple() { return handleStorage(`/img/shapes/blob-app-start--purple.svg`, getOptions("shapes", "app_start_shape_purple")) },
    get app_start_shape_red() { return handleStorage(`/img/shapes/blob-app-start--red.svg`, getOptions("shapes", "app_start_shape_red")) },
    get app_start_shape_orange() { return handleStorage(`/img/shapes/blob-app-start--orange.svg`, getOptions("shapes", "app_start_shape_orange")) },
    get app_start_shape_black() { return handleStorage(`/img/shapes/blob-app-start--black.svg`, getOptions("shapes", "app_start_shape_black")) },
    get app_start_shape_white() { return handleStorage(`/img/shapes/blob-app-start--white.svg`, getOptions("shapes", "app_start_shape_white")) },
    get app_start_shape_blue() { return handleStorage(`/img/shapes/blob-app-start--blue.svg`, getOptions("shapes", "app_start_shape_blue")) },
    get app_start_shape_green() { return handleStorage(`/img/shapes/blob-app-start--green.svg`, getOptions("shapes", "app_start_shape_green")) },
    get app_start_shape_brown() { return handleStorage(`/img/shapes/blob-app-start--brown.svg`, getOptions("shapes", "app_start_shape_brown")) },
    get app_start_shape_yellow() { return handleStorage(`/img/shapes/blob-app-start--yellow.svg`, getOptions("shapes", "app_start_shape_yellow")) },
    // Illustration
    get app_chat_illustra() { return handleStorage(`/img/illustrations/online-chat.svg`, getOptions("illustrations", "app_chat_illustra")) },
    get app_empty_purchase_illustra() { return handleStorage(`/img/illustrations/empty-woman-card.svg`, getOptions("illustrations", "app_empty_purchase_illustra")) },
    get dash_no_search_illustra() { return handleStorage(`/img/illustrations/empty-search.svg`, getOptions("illustrations", "dash_no_search_illustra")) },
    get app_version_feature_illustra2() { return handleStorage(`/img/illustrations/new.png`, getOptions("illustrations", "app_version_feature_illustra2")) },
}

export default imgLib;
export { ImgLoader }

// requires declare className to the img.
// The same name as the key. Priorly it was an ID, but there were issues when more then one src is need
function handleStorage(url, options = {}) {

    const {
        coll,
        key,
        isFromInternet = false,
        onlySet = false,
        selectorType = "single",
        needSelector = true,
    } = options;

    const localUrl = `${CLIENT_URL}${url}`;
    const urlPath = isFromInternet ? url : localUrl;
    console.log("urlPath", urlPath);

    if(onlySet) {
        findElemAndSet(key, urlPath)
        return;
    }

    return readImage(coll, key).then(generatedUrl => { // LESSON: promises can not return an async value at all. Use methods like attribute to src, setData to get the value.
        if(!generatedUrl) {
            return setImage(coll, key, urlPath)
            .then(res => {
                console.log(`New image set to indexedDB. Collection: ${coll}, dataKey: ${key}`)
                return urlPath;
            })
            .catch(err => console.log(err))
        } else {
            if(needSelector) {
                findElemAndSet(key, generatedUrl, { type: selectorType })
            } else { return generatedUrl; }
        }
    })
}

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

export { handleStorage }