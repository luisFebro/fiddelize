import { Fragment } from "react";
import PropTypes from "prop-types";
import Spinner from "./loadingIndicators/Spinner";
import { CLIENT_URL } from "../config/clientUrl";

ShowImgOrSpinner.propTypes = {
    id: PropTypes.string,
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
    setStatus: PropTypes.func.isRequired,
    status: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // spinnerOpt: PropTypes.shape({
    //     width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    //     height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    //     backgroundColor: PropTypes.string,
    // }).isRequired,
    imgOpt: PropTypes.shape({
        style: PropTypes.object,
        className: PropTypes.string,
    }),
};

export default function ShowImgOrSpinner({
    id,
    url,
    alt,
    width,
    height,
    setStatus,
    status,
    spinnerOpt,
    imgOpt,
}) {
    const imageUrl = `${CLIENT_URL}/api/${url}/photo/${id}`;

    return (
        <Fragment>
            <div style={{ display: status ? "block" : "none" }}>
                <Spinner />
            </div>
            <div style={{ display: status ? "none" : "block" }}>
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
