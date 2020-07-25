import React, { useState, useEffect } from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import Spinner from './loadingIndicators/Spinner';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import { IS_DEV } from '../config/clientUrl';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    height: "100%",
    width: "100%"
  },
  avatarSkeletonContainer: {
    height: 0,
    overflow: "hidden",
    paddingTop: "100%",
    position: "relative"
  },
  avatarLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    animation: IS_DEV ? false : "MuiSkeleton-keyframes-animate 1.5s ease-in-out infinite",
  },
}))

ImgLoader.propTypes = {
    align: PropTypes.string,
    marginY: PropTypes.number,
    mode: PropTypes.oneOf(['skeleton', 'spinner']),
    skelVariant: PropTypes.oneOf(['text', 'rect', 'circle']),
    skelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelBackColor: PropTypes.string,
}

export default function ImgLoader({
    align,
    marginY,
    src,
    dataSrc, // for dynamic image loading
    timeout = 0, // disabled as default.
    id,
    width,
    height,
    style,
    alt,
    className,
    imgContainerClass,
    mode = "spinner",
    needLoader = true,
    skelVariant = 'rect',
    skelWidth,
    skelHeight,
    skelBackColor,
}) {
    let [status, setStatus] = useState(true);

    const classes = useStyles();

    // for loading dynamic on view images with intersection observer
    useEffect(() => {
        if(src && timeout === 0) setStatus(false);
        if(timeout) setTimeout(() => setStatus(false), timeout);
    }, [src, timeout])

    const isSkeleton = mode === "skeleton"

    const pickMode = mode => {
        if(mode === "spinner") return (<Spinner marginX={width} marginY={height} isCenter={false} />);
        return(
            <div className={classes.avatarSkeletonContainer}>
                <Skeleton
                    variant={skelVariant}
                    width={skelWidth}
                    height={skelHeight}
                    className={classes.avatarLoader}
                />
            </div>
        );
    };

    return(
        <div
            style={{margin: `${marginY || 0}px 0px` }}
            className={`${imgContainerClass ?  `${imgContainerClass} container-center`: "container-center" }`}
        >
            <section style={{ ...style, display: status ? 'block' : 'none', height: isSkeleton ? "100%" : undefined, width: isSkeleton ? "100%" : undefined, visibility: !needLoader && "hidden",  }}>
                {pickMode(mode)}
            </section>
            <section style={{ display: status ? 'none' : 'block'}}>
                <img
                    id={id}
                    data-src={dataSrc}
                    className={className}
                    src={src}
                    alt={alt || id}
                    style={style}
                    width={width}
                    height={height || "auto"}
                    onLoad={() => !timeout && setStatus(false)}
                />
            </section>
        </div>
    );
}


/*
backgroundColor: skelBackColor || 'grey'
 */