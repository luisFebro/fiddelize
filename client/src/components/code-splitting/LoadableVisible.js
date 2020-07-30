import React from 'react';
import Spinner from '../loadingIndicators/Spinner';
import LoadableVisibility from "react-loadable-visibility/react-loadable";

// LESSON: this makes a screen empty and without errors apparently...
// only works if using LoadableVisible directly..
// export const LoadVisible = ({ loader, loading, ...otherProps }) => LoadableVisible({ loader, loading: loading ? loading : false });
export default function LoadableVisible(opts) {
    if(opts.loading === true) {
        opts = {
            ...opts,
            loading: () => <Spinner size="small" />,
        }
    }

    return LoadableVisibility(Object.assign({
      loading: () => null,
      delay: 200,
      timeout: 10000,
    }, opts));
};