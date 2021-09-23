// import React, { useState } from "react";
// import { Route, Redirect } from "react-router-dom";
// import isThisApp from '../../../utils/window/isThisApp';
// // import { showSnackbar } from '../../redux/actions/snackbarActions';

// const isApp = isThisApp();
// export default function PrivateRouteAdm({ component: Component, ...rest }) {
//     const { isUserAuthenticated, role } = useStoreState(state => ({
//         isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
//         role: state.userReducer.cases.currentUser.role
//     }))

//     // const dispatch = useStoreDispatch();

//     const alertAndRedirect = props => {
//         //THIS SHOWS EVEN IF THE USER IS ADMIN > showSnackbar(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
//         return (
//             <Redirect
//                 to={{
//                     pathname: isThisApp() ? "/app" : "/",
//                     state: { from: props.location }
//                 }}
//             />
//         );
//     }

//     return(
//         <Route
//             {...rest}
//             render={props =>
//                 isUserAuthenticated && role === "admin" ? (
//                     <Component {...props} />
//                 ) :  alertAndRedirect(props)
//             }
//         />
//     );
// }
