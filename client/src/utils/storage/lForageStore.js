import { readImage, setImage } from './lForage';
import { CLIENT_URL } from '../../config/clientUrl';
import ImgLoader from '../../components/ImgLoader';

// USE: import imgLib, { ImgLoader } from '../../../utils/storage/lForageStore';
/*
e.g
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
    coll_logo: ["app_fiddelize_logo"],
    coll_icons: ["app_gift", "dash_podium"],
    coll_shapes: ["dash_title_shape", ],
    coll_illustra: [],
};

const imgLib = {
    get app_fiddelize_logo() { return handleStorage("coll_logo", "app_fiddelize_logo", `img/official-logo-name.png`) },
    // Custom Icons
    get app_gift() { return handleStorage("coll_icons", "app_gift", `img/icons/pink-gift-box.png`) },
    get dash_podium() { return handleStorage("coll_icons", "dash_podium", `img/icons/podium.png`) },
    // Shapes
    get dash_title_shape() { return handleStorage("coll_shapes", "dash_title_shape", `img/shapes/blob-dashboard-header.svg`) },
    // Illustration
}

export default imgLib;
export { ImgLoader }

// requires declare id to the img. The same name as the key.
function handleStorage(coll, key, url) {
    const urlPath = `${CLIENT_URL}/${url}`;

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
