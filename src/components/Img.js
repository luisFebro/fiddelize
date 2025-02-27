import { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import Spinner from "./loadingIndicators/Spinner";
import { IS_DEV } from "../config/clientUrl";
import useImg from "../hooks/media/useImg";

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "center",
        height: "100%",
        width: "100%",
    },
    avatarSkeletonContainer: {
        height: 0,
        overflow: "hidden",
        paddingTop: "100%",
        position: "relative",
    },
    avatarLoader: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        animation: IS_DEV
            ? false
            : "MuiSkeleton-keyframes-animate 1.5s ease-in-out infinite",
    },
}));

Img.propTypes = {
    align: PropTypes.string,
    marginY: PropTypes.number,
    mode: PropTypes.oneOf(["skeleton", "spinner"]),
    skelVariant: PropTypes.oneOf(["text", "rect", "circle"]),
    skelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelBackColor: PropTypes.string,
};

export default function Img({
    align,
    offline = false,
    coll, // collection for the offline db.
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
    skelVariant = "rect",
    skelWidth,
    skelHeight,
    skelBackColor,
    title,
}) {
    const [status, setStatus] = useState(true);

    const thisSrc = useImg(src, { trigger: offline, coll, key: alt || src });

    const classes = useStyles();

    title = title && parse(title);

    // for loading dynamic on view images with intersection observer
    useEffect(() => {
        if (src && timeout === 0) setStatus(false);
        if (timeout) setTimeout(() => setStatus(false), timeout);
    }, [src, timeout]);

    const isSkeleton = mode === "skeleton";

    const pickMode = (mode) => {
        if (mode === "spinner")
            return (
                <Spinner marginX={width} marginY={height} isCenter={false} />
            );
        return (
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

    return (
        <div
            style={{ margin: `${marginY || 0}px 0px` }}
            className={`${
                imgContainerClass
                    ? `${imgContainerClass} container-center`
                    : "container-center"
            }`}
        >
            <section
                style={{
                    ...style,
                    display: status ? "block" : "none",
                    height: isSkeleton ? "100%" : undefined,
                    width: isSkeleton ? "100%" : undefined,
                    visibility: !needLoader && "hidden",
                }}
            >
                {pickMode(mode)}
            </section>
            <section style={{ display: status ? "none" : "block" }}>
                <img
                    id={id}
                    style={style}
                    data-src={dataSrc}
                    className={className}
                    src={thisSrc || src}
                    alt={alt || id}
                    width={width}
                    height={height || "auto"}
                    onLoad={() => !timeout && setStatus(false)}
                    onError={(e) => (e.src = "/img/error.png")}
                />
                {title && (
                    <div className="text-purple text-subtitle font-weight-bold text-center">
                        {title}
                    </div>
                )}
            </section>
        </div>
    );
}

/*
backgroundColor: skelBackColor || 'grey'
 */
