import LoadableVisibility from "react-loadable-visibility/react-loadable";
// import LogoSpinner from ''

export default function LoadableVisible(opts) {
  return LoadableVisibility(Object.assign({
    loading: () => null,
    delay: 200,
    timeout: 10000,
  }, opts));
};