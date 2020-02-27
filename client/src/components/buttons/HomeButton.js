import React from 'react';
import { Link } from "react-router-dom";
import ButtonMulti from './material-ui/ButtonMulti';
import { useStoreDispatch } from 'easy-peasy';
import { showComponent } from "../../redux/actions/componentActions";
import { logout } from "../../redux/actions/authActions";
import isThisApp from '../../utils/window/isThisApp';

export default function HomeButton() {
    const dispatch = useStoreDispatch();

    return (
        <div className="my-5">
            <Link to={isThisApp() ? "/mobile-app" : "/acesso/verificacao" } style={{textDecoration: "none"}}>
                <ButtonMulti
                    onClick={() => {
                        showComponent(dispatch, "login")
                        !isThisApp() && logout(dispatch);
                    }}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform='uppercase'
                    iconFontAwesome={isThisApp() ? "fas fa-home" : ""}
                >
                    Voltar
                </ButtonMulti>
            </Link>
        </div>
    );
}