import React from 'react';

export default function Picture({ path, responsive, ...props }) {
    return (
        <picture>
            <source srcSet={`${path}.webp`} type="image/webp" />
            <source srcSet={`${path}.png`} type="image/png" />
            <img
                className={props.className}
                src={`${path}.png`}
                alt={props.alt}
                width={props.width}
                height={props.height || "auto"}
            />
        </picture>
    );
}