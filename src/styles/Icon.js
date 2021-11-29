// some other custom svg icons go here
import { Fragment } from "react";

export default function Icon({
    type = "support",
    fill = "#fff",
    style = { fontSize: "35px" },
    className,
}) {
    const selectedIcon = getIcon(type);

    return (
        <svg
            focusable={false}
            className={`${className} custom-icon`}
            fill={fill}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 24 24"
            viewBox="0 0 24 24"
        >
            {selectedIcon}
            <style jsx>
                {`
                    .custom-icon {
                        fill: currentColor;
                        width: 1em; /* width and height is elementary here */
                        height: 1em;
                        display: inline-block;
                        flex-shrink: 0;
                        user-select: none;
                    }
                `}
            </style>
        </svg>
    );
}

function getIcon(type) {
    if (type === "support") {
        return (
            <Fragment>
                <g>
                    <rect fill="none" />
                </g>
                <g>
                    <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M19.46,9.12l-2.78,1.15 c-0.51-1.36-1.58-2.44-2.95-2.94l1.15-2.78C16.98,5.35,18.65,7.02,19.46,9.12z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3 S13.66,15,12,15z M9.13,4.54l1.17,2.78c-1.38,0.5-2.47,1.59-2.98,2.97L4.54,9.13C5.35,7.02,7.02,5.35,9.13,4.54z M4.54,14.87 l2.78-1.15c0.51,1.38,1.59,2.46,2.97,2.96l-1.17,2.78C7.02,18.65,5.35,16.98,4.54,14.87z M14.88,19.46l-1.15-2.78 c1.37-0.51,2.45-1.59,2.95-2.97l2.78,1.17C18.65,16.98,16.98,18.65,14.88,19.46z" />
                </g>
            </Fragment>
        );
    }

    if (type === "qrCodeScanner") {
        return (
            <Fragment>
                <rect fill="none" height="24" width="24" />
                <path d="M9.5,6.5v3h-3v-3H9.5 M11,5H5v6h6V5L11,5z M9.5,14.5v3h-3v-3H9.5 M11,13H5v6h6V13L11,13z M17.5,6.5v3h-3v-3H17.5 M19,5h-6v6 h6V5L19,5z M13,13h1.5v1.5H13V13z M14.5,14.5H16V16h-1.5V14.5z M16,13h1.5v1.5H16V13z M13,16h1.5v1.5H13V16z M14.5,17.5H16V19h-1.5 V17.5z M16,16h1.5v1.5H16V16z M17.5,14.5H19V16h-1.5V14.5z M17.5,17.5H19V19h-1.5V17.5z M22,7h-2V4h-3V2h5V7z M22,22v-5h-2v3h-3v2 H22z M2,22h5v-2H4v-3H2V22z M2,2v5h2V4h3V2H2z" />
            </Fragment>
        );
    }

    throw new Error("type of icon not found");
}
