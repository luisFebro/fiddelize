import React, { useState, useEffect } from 'react';
import { handleStorage } from '../../utils/storage/lForageStore';

export default function useImg(url, options = {}) {
    const { coll = "imgs", key } = options;

    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(!done && url) {
            console.log("RUNNING USEIMG BITCH")
            const options = { coll, key, needSelector: false }
            handleStorage(url, options)
            .then(generatedSrc => {
                setSrc(generatedSrc);
                setLoading(false);
                setDone(true);
            })
        }
    }, [url])

    return { src, loading };
}