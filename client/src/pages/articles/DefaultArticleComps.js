import React from 'react';
import ImgLoader from '../../components/ImgLoader';

export const textStyle = 'text-purple text-left text-normal mx-3';

export const ShowTitle = ({ text = "Instrução Fiddelize" }) => (
    <div className="mt-4">
        <h1
            className="text-subtitle text-purple text-center font-weight-bold"
        >
            {text}
        </h1>
    </div>
);

export const ShowArticleTitle = ({ title = "some title" }) => (
    <h2
        className="font-site text-em-1-2 text-purple text-center font-weight-bold"
    >
       {title}
    </h2>
);

export const ShowPicture = ({
    pic = "/img/articles/gift-visibility/main.jpg",
    source,
    subtitle,
    main = false,
}) => {

    return (
        <div className={`img-center position-relative ${main ? "mt-1 mb-5" : "my-3"}`}>
            <ImgLoader
                src={pic}
                mode="skeleton"
                className="shadow-elevation"
                alt="foto principal"
            />
            {source && (
                <p className="mt-2 text-purple text-right text-small font-weight-bold">
                    fonte: {source}
                </p>
            )}

            {subtitle && (
                <p className="mt-2 text-purple text-center text-small font-weight-bold">{subtitle}</p>
            )}
        </div>
    );
}