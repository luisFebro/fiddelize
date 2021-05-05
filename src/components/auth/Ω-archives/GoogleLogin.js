import { useState } from "react";
// import { default as GL } from "react-google-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import getAPI, { makeGoogleLogin } from "api";
import ButtonFab from "../buttons/material-ui/ButtonFab";
import getVar from "init/var";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useBizData } from "init";

const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px grey)",
    color: "white",
};

export default withRouter(GoogleLogin);

// THIS PIECE OF SHIT DOES NOT WORK ON MOBILE APPS.
// TRY EXPLORE THE DOCS IN DEPTH TO HAVE MY OWN COMP NEXT TIME.
function GoogleLogin({ history }) {
    const [testFront, setTestFront] = useState("");
    const [testBack, setTestBack] = useState("");
    const dispatch = useStoreDispatch();
    const { themeBackColor: backColor } = useBizData();

    const handleSuccess = async (response) => {
        showSnackbar(dispatch, "Conectando... Um momento.");

        const userId = await getVar("userId", "user");

        const { tokenId } = response;
        const body = { userId, tokenId };

        const { data: newToken } = await getAPI({
            method: "post",
            url: makeGoogleLogin(),
            body,
            trigger: userId && tokenId,
        });

        setTestBack(newToken);

        // authenticate(newToken, { dispatch, history });
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
        <>
            <GL
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={handleSuccess}
                onFailure={handleError}
                icon={false}
                className={`theme-back--${backColor} no-border`}
                isSignedIn={false} // attribute will call onSuccess callback on load to keep the user signed in.
                responseType="" // the code is useless for server validation though If responseType is 'code', callback will return the authorization code that can be used to retrieve a refresh token from the server.
                // accessType="offline"
                uxMode="popup" // popup does not appear on mobile.
                cookiePolicy="single_host_origin"
                // n1 other props
            >
                <CustomBtn />
            </GL>
            <br />
            <p className="text-break mx-2 text-white text-normal">
                {JSON.stringify(testFront)}
            </p>
            <p className="text-break mx-2 text-white text-normal">
                {JSON.stringify(testBack)}
            </p>
        </>
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
