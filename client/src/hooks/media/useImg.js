import React, { useState, useEffect } from 'react';
import { handleStorage } from '../../utils/storage/lForageStore';
import { default as Img } from '../../components/ImgLoader';

export { Img };

export default function useImg(url, options = {}) {
    const {
        coll = "imgs",
        key,
        trigger = true,
    } = options;

    const [src, setSrc] = useState(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if(trigger && !done && url) {
            const isWeb = url.indexOf("https://") !== -1
            const options = { coll, key, isFromInternet: isWeb, needSelector: false }
            handleStorage(url, options)
            .then(generatedSrc => {
                setSrc(generatedSrc);
                setDone(true);
            })
        }
    }, [url, trigger])

    return src; // n1
}


/* COMMENTS
n1: does not need loading because there is an img loader which handles it Img compoenent
*/