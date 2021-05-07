import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import {
    loginEmail,
    registerFacebook,
} from "../../../../redux/actions/authActions";
// End Redux

export default function FacebookAuth() {
    // REDUX
    const { userList } = useStoreState((state) => ({
        userList: state.userReducer.cases.allUsers,
    }));
    const dispatch = useStoreDispatch();
    // END REDUX

    const emailAllRegisteredUsers = userList.map((user) => user.email);

    const responseFacebook = (response) => {
        const userEmail = response.email;
        const isEmailAlreadyRegistered = emailAllRegisteredUsers.includes(
            userEmail
        );
        // Check if the user is already registed to either log in or Register
        if (isEmailAlreadyRegistered) {
            // Login
            const dataUser = {
                email: userEmail,
                password: process.env.REACT_APP_PASSWORD_AUTH_FACEBOOK,
            };

            loginEmail(dispatch, dataUser);
            showSnackbar(dispatch, "Quase pronto...");
            setTimeout(
                () =>
                    showSnackbar(
                        dispatch,
                        "Conectado com sua conta Facebook",
                        "success"
                    ),
                3000
            );
        } else {
            // Register
            const newUser = {
                name: response.givenName,
                email: userEmail,
                password: process.env.REACT_APP_PASSWORD_AUTH_FACEBOOK,
                registeredBy: "facebook",
            };

            registerFacebook(dispatch, newUser);
            showSnackbar(dispatch, "Conta Babadoo criada via Facebook!");
        }

        // Authenticate User
        showSnackbar(dispatch, "carregando...");
        // showSnackbar(dispatch, 'Seja Bem-vindo(a)');
        dispatch({ type: "LOGIN_FACEBOOK", payload: response });
    };

    const componentClicked = () => {};

    return (
        <FacebookLogin
            appId={process.env.REACT_APP_SOCIAL_FACEBOOK}
            autoLoad={false}
            fields="name,email,picture"
            onClick={componentClicked}
            callback={responseFacebook}
            render={(renderProps) => (
                <button
                    className="btn login-btn"
                    style={{
                        backgroundColor: "#3B5899",
                        margin: 5,
                        display: "block",
                    }}
                    onClick={renderProps.onClick}
                >
                    <img
                        src="img/icons/buttonslogin/facebook.png"
                        alt="ícone de login do google"
                        className="btn-icon"
                    />
                    <span className="btn-txt">
                        Entrar com <strong>Facebook</strong>
                    </span>
                </button>
            )}
        />
    );
}
