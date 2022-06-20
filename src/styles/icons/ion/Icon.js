// e.g https://unpkg.com/ionicons@5.5.2/dist/ionicons/svg/document-text.svg

export default function Icon({ children }) {
    return (
        <span
            role="img"
            name="document-text"
            className="ionicon--root"
            aria-label="document text"
        >
            <div className="icon-inner">{children}</div>
            <style jsx>
                {`
                    .ionicon--root {
                        visibility: inherit;
                        display: inline-block;
                        width: 1em;
                        height: 1em;
                        contain: strict;
                        fill: currentcolor;
                        box-sizing: border-box;
                    }

                    .ionicon {
                        stroke: currentcolor;
                    }

                    .icon-inner,
                    .ionicon,
                    svg {
                        display: block;
                        height: 100%;
                        width: 100%;
                    }
                `}
            </style>
        </span>
    );
}
