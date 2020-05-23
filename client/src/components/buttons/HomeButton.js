import React from 'react';
import { Link } from "react-router-dom";
import ButtonMulti, { faStyle } from './material-ui/ButtonMulti';
import { useStoreDispatch } from 'easy-peasy';
import { showComponent } from "../../redux/actions/componentActions";
import { logout } from "../../redux/actions/authActions";
import isThisApp from '../../utils/window/isThisApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from '../../hooks/useRoleData';

export default function HomeButton() {
    const dispatch = useStoreDispatch();

    const { selfThemeSColor, selfThemeBackColor } = useClientAdmin();

    return (
        <div className="my-5">
            <Link to={isThisApp() ? "/mobile-app" : "/acesso/verificacao" } style={{textDecoration: "none"}}>
                <ButtonMulti
                    onClick={() => {
                        showComponent(dispatch, "login")
                        !isThisApp() && logout(dispatch);
                    }}
                    color="var(--mainWhite)"
                    backgroundColor={"var(--themeSDark--" + selfThemeSColor + ")"}
                    iconFontAwesome={isThisApp() ? <FontAwesomeIcon icon="home" style={faStyle} /> : ""}
                    shadowColor={selfThemeBackColor === "black" ? "white" : "black"}
                >
                    Voltar
                </ButtonMulti>
            </Link>
        </div>
    );
}