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
    src={imgLib.dash_podium}
    width={300}
    height={250}
    className="shadow-elevation-black"
/>
 */
// dataKey syntax: location_description
// Rules: it should not fetch multiple images from one single instance like prior convert_any_illustration. This duplicates worngly images. Each image should have its own instance.
const imgLib = {
    get app_fiddelize_logo() { return handleStorage("logos", "app_fiddelize_logo", `img/official-logo-name.png`) },
    app_biz_logo: url => handleStorage("logos", "app_biz_logo", url, true),
    // Custom Icons
    get app_gift() { return handleStorage("icons", "app_gift", `img/icons/pink-gift-box.png`) },
    get dash_podium() { return handleStorage("icons", "dash_podium", `img/icons/podium.png`) },
    // Shapes - check for multiple request found after inserting the first svg shape...
    get dash_title_shape() { return handleStorage("shapes", "dash_title_shape", `img/shapes/blob-dashboard-header.svg`) },
    get app_start_shape_default() { return handleStorage("shapes", "app_start_shape_default", `img/shapes/blob-app-start--default.svg`) },
    get app_start_shape_pink() { return handleStorage("shapes", "app_start_shape_pink", `img/shapes/blob-app-start--pink.svg`) },
    get app_start_shape_purple() { return handleStorage("shapes", "app_start_shape_purple", `img/shapes/blob-app-start--purple.svg`) },
    get app_start_shape_red() { return handleStorage("shapes", "app_start_shape_red", `img/shapes/blob-app-start--red.svg`) },
    get app_start_shape_orange() { return handleStorage("shapes", "app_start_shape_orange", `img/shapes/blob-app-start--orange.svg`) },
    get app_start_shape_black() { return handleStorage("shapes", "app_start_shape_black", `img/shapes/blob-app-start--black.svg`) },
    get app_start_shape_white() { return handleStorage("shapes", "app_start_shape_white", `img/shapes/blob-app-start--white.svg`) },
    get app_start_shape_blue() { return handleStorage("shapes", "app_start_shape_blue", `img/shapes/blob-app-start--blue.svg`) },
    get app_start_shape_green() { return handleStorage("shapes", "app_start_shape_green", `img/shapes/blob-app-start--green.svg`) },
    get app_start_shape_brown() { return handleStorage("shapes", "app_start_shape_brown", `img/shapes/blob-app-start--brown.svg`) },
    get app_start_shape_yellow() { return handleStorage("shapes", "app_start_shape_yellow", `img/shapes/blob-app-start--yellow.svg`) },
    // Illustration
    get app_chat_illustra() { return handleStorage("illustrations", "app_chat_illustra", `img/illustrations/online-chat.svg`) },
    get app_empty_purchase_illustra() { return handleStorage("illustrations", "app_empty_purchase_illustra", `img/illustrations/online-chat.svg`) },
    get dash_no_search_illustra() { return handleStorage("illustrations", "dash_no_search_illustra", `img/illustrations/empty-search.svg`) },
}

export default imgLib;
export { ImgLoader }

// requires declare className to the img.
// The same name as the key. Priorly it was an ID, but there were issues when more then one src is need
function handleStorage(coll, key, url, isFromInternet = false) {
    const urlPath = isFromInternet ? url : `${CLIENT_URL}/${url}`;

    const readThisImage = () => readImage(coll, key)
    readThisImage().then(generatedUrl => { // LESSON: promises can not return an async value at all. Use methods like attribute to src, setData to get the value.
        if(!generatedUrl) {
            setImage(coll, key, urlPath)
            .then(res => console.log(`New image set to indexedDB. Collection: ${coll}, dataKey: ${key}`))
            .catch(err => console.log(err))
        } else {
            const doc = document.querySelectorAll(`.${key}`);
            if(doc) {
                doc.forEach(elemFound => elemFound.src = generatedUrl);
            }
        }
    })
}
