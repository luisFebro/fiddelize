import Loadable from 'react-loadable';
// import FullPageLoading from './loadingIndicators/FullPageLoading';

export default function LoadableComp(opts) { //n1
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