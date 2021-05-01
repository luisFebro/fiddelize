import { Link, withRouter } from "react-router-dom";

import { useStoreDispatch } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, {
    faStyle,
} from "../../components/buttons/material-ui/ButtonFab";
import { useBizData } from "init";
import { setRun } from "../../redux/actions/globalActions";

function ReturnBtn({ location, icon = "home", onClick }) {
    const { bizLinkName } = useBizData();

    const isCliAdmin = location.search === "?cliente-admin=1";

    const dispatch = useStoreDispatch();
    const isFunc = typeof onClick === "function";

    return (
        <div className="position-absolute" style={{ top: 15, left: 15 }}>
            {isFunc && (
                <ButtonFab
                    onClick={onClick}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon={icon}
                            style={{
                                ...faStyle,
                                fontSize: "20px",
                                filter: "nothing",
                            }}
                        />
                    }
                />
            )}

            {isCliAdmin && !isFunc && (
                <Link
                    className="no-text-decoration"
                    to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <ButtonFab
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        iconFontAwesome={
                            <FontAwesomeIcon
                                icon={icon}
                                style={{ ...faStyle, fontSize: "20px" }}
                            />
                        }
                    />
                </Link>
            )}
        </div>
    );
}

export default withRouter(ReturnBtn);
