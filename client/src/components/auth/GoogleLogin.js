import React from "react";
import { default as GL } from "react-google-login";
import getAPI, { makeGoogleLogin } from "../../utils/promises/getAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../buttons/material-ui/ButtonFab";
import { getVar, store } from "../../hooks/storage/useVar";
import authenticate from "../../components/auth/helpers/authenticate";
import { withRouter } from "react-router-dom";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import { useClientAdmin } from "../../hooks/useRoleData";

const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px grey)",
    color: "white",
};

export default withRouter(GoogleLogin);

function GoogleLogin({ history }) {
    const dispatch = useStoreDispatch();
    const { selfThemeBackColor: backColor } = useClientAdmin();

    const handleSuccess = async (response) => {
        showSnackbar(dispatch, "Conectando... Um momento.");

        const userId = await getVar("userId", store.user);

        const { tokenId } = response;
        const body = { userId, tokenId };

        const { data: newToken } = await getAPI({
            method: "post",
            url: makeGoogleLogin(),
            body,
            trigger: userId && tokenId,
        });

        authenticate(newToken, { dispatch, history });
    };

    const handleError = (response) => {
        console.log("ERORR response", response);
    };

    const CustomBtn = (renderProps) => (
        <ButtonFab
            title="GOOGLE"
            iconFontAwesome={
                <FontAwesomeIcon icon="lock" style={awesomeStyle} />
            }
            backgroundColor="var(--themeSDark--default)"
            onClick={null}
            position="relative"
            variant="extended"
            size="large"
        />
    );

    return (
        <GL
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            onSuccess={handleSuccess}
            onFailure={handleError}
            icon={false}
            className={`theme-back--${backColor} no-border`}
            isSignedIn={false} // If true will return GoogleUser object on load, if user has given your app permission
            cookiePolicy={"single_host_origin"}
            // n1 other props
        >
            <CustomBtn />
        </GL>
    );
}

/*
prompt="consent"
buttonText="GOOGLE"
theme={"dark"}
onAutoLoadFinished={null} // after the button has loaded and ready;
onRequest={}// do not insert null otherwise the button won't work on click () => setTimeout(() => showSnackbar(dispatch, "Conectando... Um momento."), 4000)
 */

/*
render={renderProps => (
    <CustomBtn renderProps={renderProps} />
)}
 */
