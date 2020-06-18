import React from 'react';
import LoadableComp from '../../../../components/code-splitting/LoadableComp';
import Spinner from '../../../../components/loadingIndicators/Spinner';
import { IS_DEV } from '../../../../config/clientUrl';

const AsyncPickTheming = LoadableComp({ // n1
  loader: () => import("./PickTheming"  /* webpackChunkName: "pick-theming-comp-lazy" */),
  loading: () => IS_DEV ? null : <Spinner marginY={50} width={200} height={200} size="large" />,
});

export default AsyncPickTheming;

// Attempt to create my own lib
// const loadComponent = async (command) => {
//     const PickTheming = await import('./PickTheming' /* webpackChunkName: "pick-theming-comp-lazy" */);
//     return PickTheming.default;
// }

// const AsyncPickTheming = () => {
//     const [hideLoader, setHideLoader] = useState(false);
//     const [Module, setModule] = useState(null);
//     console.log("<Module />", Module);

//     React.useEffect(() => {
//         if(Module) setHideLoader(true);
//     }, [Module])

//     React.useEffect(() => {
//         loadComponent().then(res => setModule(res))
//     }, [])

//     return <Module />;
// }