import React from 'react';
import { Link } from "react-router-dom";
import ButtonMulti from './material-ui/ButtonMulti';
import isThisApp from '../../utils/window/isThisApp';

export default function InitialPageButton() {

    return (
        <div className="my-5">
            <Link to={isThisApp() ? "/mobile-app" : "/"} className="text-decoration-none">
                <ButtonMulti
                    title="Voltar"
                    color="var(--mainWhite)"
                    iconFontAwesome="fas fa-home"
                    backgroundColor="var(--mainPink)"
                    backColorOnHover="var(--mainPink)"
                    textTransform='uppercase'
                />
            </Link>
        </div>
    );
}