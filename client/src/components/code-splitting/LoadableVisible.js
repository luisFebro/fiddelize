import LoadableVisibility from "react-loadable-visibility/react-loadable";
import Loading from "./my-loading-component";
// import LogoSpinner from ''

export default function LoadableVisible(opts) {
  return LoadableVisibility(Object.assign({
    loading: () => null,
    delay: 200,
    timeout: 10000,
  }, opts));
};