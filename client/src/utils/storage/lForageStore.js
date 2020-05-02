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
export const collectionStore = {
    logos: ["app_fiddelize_logo", "app_biz_logo"],
    icons: ["app_gift", "dash_podium"],
    shapes: ["dash_title_shape", "app_start_shape"],
    illustrations: ["convert_any_illustration", "app_chat_illustra"],
};

const imgLib = {
    get app_fiddelize_logo() { return handleStorage("logos", "app_fiddelize_logo", `img/official-logo-name.png`) },
    app_biz_logo: url => handleStorage("logos", "app_biz_logo", url, true),
    // Custom Icons
    get app_gift() { return handleStorage("icons", "app_gift", `img/icons/pink-gift-box.png`) },
    get dash_podium() { return handleStorage("icons", "dash_podium", `img/icons/podium.png`) },
    // Shapes - check for multiple request found after inserting the first svg shape...
    get dash_title_shape() { return handleStorage("shapes", "dash_title_shape", `img/shapes/blob-dashboard-header.svg`) },
    get app_start_shape() { return handleStorage("shapes", "app_start_shape", `img/shapes/blob1.svg`) },
    // Illustration
    convert_any_illustration: url => handleStorage("illustrations", "convert_any_illustration", url, true),
    get app_chat_illustra() { return handleStorage("illustrations", "app_chat_illustra", `img/illustrations/online-chat.svg`) },
}

export default imgLib;
export { ImgLoader }

// requires declare id to the img. The same name as the key.
function handleStorage(coll, key, url, isFromInternet = false) {
    const urlPath = isFromInternet ? url : `${CLIENT_URL}/${url}`;

    const readThisImage = () => readImage(coll, key)
    readThisImage().then(generatedUrl => { // LESSON: promises can not return an async value at all. Use methods like attribute to src, setData to get the value.
        if(!generatedUrl) {
            setImage(coll, key, urlPath)
            .then(res => {
                console.log(`New image set to indexedDB. Collection: ${coll}, dataKey: ${key}`);
                readThisImage()
                .then(generatedUrl => {
                    const doc = document.querySelector(`#${key}`);
                    if(doc) doc.src = generatedUrl;
                })
            })
            .catch(err => console.log(err))
        } else {
            const doc = document.querySelector(`#${key}`);
            if(doc) doc.src = generatedUrl;
        }
    })
}
