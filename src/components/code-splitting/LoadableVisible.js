import LoadableVisibility from "react-loadable-visibility/react-loadable";
import Spinner from "../loadingIndicators/Spinner";

// only works if using LoadableVisible directly..
// WARNING AND LESSON: do not use loading: false... remove loading altogether this makes a screen empty and without errors apparently....
// export const LoadVisible = ({ loader, loading, ...otherProps }) => LoadableVisible({ loader, loading: loading ? loading : false });
export default function LoadableVisible(opts) {
    if (opts.loading === true) {
        opts = {
            ...opts,
            loading: () => (
                <Spinner
                    size={opts.logo ? "large" : "small"}
                    logo={opts.logo ? "purple" : ""}
                />
            ),
        };
    }

    return LoadableVisibility({
        loading: () => null,
        delay: 200,
        timeout: 10000,
        ...opts,
    });
}
