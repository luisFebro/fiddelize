import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, { faStyle } from "./material-ui/ButtonMulti";
import isThisApp from "../../utils/window/isThisApp";

export default function InitialPageButton() {
    return (
        <div className="my-5">
            <Link
                to={isThisApp() ? "/mobile-app" : "/"}
                className="text-decoration-none"
            >
                <ButtonMulti
                    title="Voltar"
                    color="var(--mainWhite)"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="home" style={faStyle} />
                    }
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform="uppercase"
                />
            </Link>
        </div>
    );
}
