import React from 'react';
import Spinner from '../loadingIndicators/Spinner';
import Loadable from 'react-loadable';
// import FullPageLoading from './loadingIndicators/FullPageLoading';

// This Load one will be the official one which will be placed
// directed into the component wihtout the need of create an Async file.
// MAke sure to name the component with prefix Async...
export const Load = ({ loader, loading, ...otherProps }) => LoadableComp({ loader, loading: loading ? loading : true });

export default function LoadableComp(opts) { //n1
    if(opts.loading === true) {
        opts = {
            ...opts,
            loading: () => <Spinner size="small" />,
        }
    }

    return Loadable(Object.assign({
      loading: () => null,
      delay: 200,
      timeout: 10000,
    }, opts));
};

/* COMMENTS
n1: set loading: () => null, if you do not want a loader.
n2: structure for loading key props:
function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.timedOut) {
    return <div>Taking a long time... <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}
*/