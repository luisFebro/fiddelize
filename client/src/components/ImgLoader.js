import React, { useState, useEffect } from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import Spinner from './loadingIndicators/Spinner';
import PropTypes from 'prop-types';

ImgLoader.propTypes = {
    align: PropTypes.string,
    marginY: PropTypes.number,
    mode: PropTypes.oneOf(['skeleton', 'spinner'])
}

export default function ImgLoader({
    align,
    marginY,
    id,
    src,
    width,
    height,
    style,
    alt,
    className,
    modeProps,
    mode = "spinner",
    needLoader = true, }) {

    const [status, setStatus] = useState(true);

    useEffect(() => {
        if(src) {
            setStatus(false);
        }
    }, [src])

    return(
        <div style={{margin: `${marginY || 0}px 0px` }} className="container-center">
            <div style={{ ...style, display: status ? 'block' : 'none', visibility: !needLoader && "hidden" }}>
                <Spinner marginX={width} marginY={height}  />
            </div>
            <div style={{ display: status ? 'none' : 'block'}}>
                <img
                    id={id}
                    className={className}
                    src={src}
                    alt={alt || id}
                    style={style}
                    width={width}
                    height={height || "auto"}
                    onLoad={() => setStatus(false)}
                />
            </div>
        </div>
    );
}
