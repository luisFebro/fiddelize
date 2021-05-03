import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import disconnect from "init/disconnect";
import isThisApp from "utils/window/isThisApp";
import { useBizData } from "init";
import ButtonMulti, { faStyle } from "./material-ui/ButtonMulti";

function HomeButton({ location }) {
    const isClientAdmin = location.search.includes("admin=1");

    const { themeSColor, themeBackColor } = useBizData();

    const handleLink = () => {
        if (isThisApp()) {
            return isClientAdmin ? "/mobile-app?client-admin=1" : "/mobile-app";
        }
        return "/acesso/verificacao";
    };

    return (
        <div className="my-5">
            <Link to={handleLink()} style={{ textDecoration: "none" }}>
                <ButtonMulti
                    onClick={() => {
                        if (!isThisApp()) disconnect();
                    }}
                    color="var(--mainWhite)"
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    iconFontAwesome={
                        isThisApp() ? (
                            <FontAwesomeIcon icon="home" style={faStyle} />
                        ) : (
                            ""
                        )
                    }
                    shadowColor={themeBackColor === "black" ? "white" : "black"}
                >
                    Voltar
                </ButtonMulti>
            </Link>
        </div>
    );
}

export default withRouter(HomeButton);
