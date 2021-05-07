import GoogleLogin from "react-google-login";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import {
    registerGoogle,
    loginEmail,
} from "../../../../redux/actions/authActions";
// End Redux
// import parse from 'html-react-parser';

export default function GoogleAuth() {
    // REDUX
    const dispatch = useStoreDispatch();
    const { userList } = useStoreState((state) => ({
        userList: state.userReducer.cases.allUsers,
    }));
    // END REDUX

    // very bad idea!!!
    const emailAllRegisteredUsers = userList.map((user) => user.email);

    const handleSuccessGoogle = (response) => {
        const { email, givenName, familyName } = response.profileObj;
        const isEmailAlreadyRegistered = emailAllRegisteredUsers.includes(
            email
        );
        // Check if the user is already registed to either log in or Register
        if (isEmailAlreadyRegistered) {
            // Login
            const dataUser = {
                email,
                password: process.env.REACT_APP_PASSWORD_AUTH_GOOGLE,
            };

            showSnackbar(dispatch, "Quase Pronto...", "success");
            loginEmail(dispatch, dataUser).then((res) => {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                showSnackbar(
                    dispatch,
                    "Conectado com sua conta Google",
                    "success"
                );
                setTimeout(
                    () => showSnackbar(dispatch, res.data.msg, "success", 4000),
                    3000
                );
            });
        } else {
            // Register
            const newUser = {
                name: `${givenName} ${familyName}`,
                email,
                password: process.env.REACT_APP_PASSWORD_AUTH_GOOGLE,
                registeredBy: "google",
            };
            registerGoogle(dispatch, newUser, response);
            showSnackbar(dispatch, "Conta Babadoo criada via Google!");
        }
    };

    const handleErrorGoogle = () => {
        showSnackbar(
            dispatch,
            "Não foi possível conectar com o Google. Tente novamente.",
            "error",
            5000
        );
    };

    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_SOCIAL_GOOGLE}
            render={(renderProps) => (
                <button
                    className="btn login-btn"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{
                        backgroundColor: "#CB4024",
                        border: "none",
                        margin: 5,
                        display: "block",
                    }}
                >
                    <img
                        src="img/icons/buttonslogin/google.png"
                        alt="ícone de login do google"
                        className="btn-icon"
                    />
                    <span className="btn-txt">
                        Entrar com <strong>Google</strong>
                    </span>
                </button>
            )}
            onSuccess={handleSuccessGoogle}
            onFailure={handleErrorGoogle}
            cookiePolicy="single_host_origin"
        />
    );
}
