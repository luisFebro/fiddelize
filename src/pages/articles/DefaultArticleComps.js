import Img from "../../components/Img";
import useElemShowOnScroll from "../../hooks/scroll/useElemShowOnScroll";

export { useElemShowOnScroll };

export const textStyle = "text-purple text-left text-normal mx-3";

export const ShowTitle = ({ title = "some main title" }) => (
    <div className="mt-4">
        <h1 className="text-subtitle text-purple text-center font-weight-bold">
            {title}
        </h1>
    </div>
);

export const ShowArticleTitle = ({ title = "some title" }) => (
    <h2 className="my-4 font-site text-em-1-3 text-purple text-center font-weight-bold">
        {title}
    </h2>
);

export const ShowPicture = ({
    src,
    dataSrc,
    reference,
    subtitle,
    timeout,
    main = false,
    imgContainerClass, // for reading intersection observer
}) => (
    // images loaded with intersection observer...
    <div className={`position-relative ${main ? "mt-1 mb-5" : "my-3"}`}>
        <Img
            dataSrc={dataSrc}
            timeout={timeout}
            src={src}
            mode="skeleton"
            className="img-center shadow-elevation"
            imgContainerClass={imgContainerClass}
            alt="foto principal"
        />
        {reference && (
            <p className="mt-2 text-purple text-right text-small font-weight-bold">
                fonte: {reference}
            </p>
        )}

        {subtitle && (
            <p className="mt-2 text-purple text-center text-small font-weight-bold">
                {subtitle}
            </p>
        )}
    </div>
);
