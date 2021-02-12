import React, { Fragment, useState } from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import { CLIENT_URL } from "../config/clientUrl";
import PropTypes from 'prop-types';

ShowImgOrSkeleton.propTypes = {
    id: PropTypes.string,
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
    setStatus: PropTypes.func.isRequired,
    status: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    skeletonOpt: PropTypes.shape({
        variant: PropTypes.oneOf(['text', 'rect', 'circle']),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        backgroundColor: PropTypes.string,
    }).isRequired,
    imgOpt: PropTypes.shape({
        style: PropTypes.object,
        className: PropTypes.string,
    })
}

export default function ShowImgOrSkeleton({
    id, url, alt, width, height, setStatus, status, skeletonOpt, imgOpt }) {
    const imageUrl = `${CLIENT_URL}/api/${url}/photo/${id}`;

    return(
        <Fragment>
            <div style={{ display: status ? 'block' : 'none'}}>
                <Skeleton
                    variant={skeletonOpt.variant}
                    width={skeletonOpt.width}
                    height={skeletonOpt.height}
                    style={{ backgroundColor: skeletonOpt.backgroundColor}}
                />
            </div>
            <div style={{ display: status ? 'none' : 'block'}}>
                <img
                    className={imgOpt && imgOpt.className}
                    src={imageUrl}
                    alt={alt}
                    style={imgOpt && imgOpt.style}
                    width={width}
                    height={height}
                    onLoad={() => setStatus(false)}
                />
            </div>
        </Fragment>
    );
}
