// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import { useStoreState } from 'easy-peasy';
// import isThisApp from '../../../utils/window/isThisApp';
// // import { showSnackbar } from '../../redux/actions/snackbarActions';

// const isApp = isThisApp();
// export default function PrivateRouteStaff({ component: Component, ...rest }) {
//     const { isUserAuthenticated, role } = useStoreState(state => ({
//         isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
//         role: state.userReducer.cases.currentUser.role
//     }))

//     // const dispatch = useStoreDispatch();

//     const alertAndRedirect = props => {
//         //showSnackbar(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
//         return (
//             <Redirect
//                 to={{
//                     pathname: isThisApp() ? "/mobile-app" : "/",
//                     state: { from: props.location }
//                 }}
//             />
//         );
//     }

//     return(
//         <Route
//             {...rest}
//             render={props =>
//                 isUserAuthenticated && role === "colaborador" ? (
//                     <Component {...props} />
//                 ) :  alertAndRedirect(props)
//             }
//         />
//     );
// }

