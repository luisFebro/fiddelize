// Choose this over BackBtn
import { Link, withRouter } from "react-router-dom";

import { useStoreDispatch } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, { faStyle } from "./material-ui/ButtonFab";
import { useClientAdmin } from "../../hooks/useRoleData";
import { setRun } from "../../redux/actions/globalActions";
import RedirectLink from "../RedirectLink";

function ReturnBtn({
    location,
    icon = "home",
    returnIcon = "arrow-left",
    onClick,
    toAdminDash,
    btnColor = "default",
    toTab,
}) {
    const { bizCodeName } = useClientAdmin();

    const isCliAdmin = toAdminDash || location.search === "?cliente-admin=1";

    const dispatch = useStoreDispatch();
    const isFunc = typeof onClick === "function";

    if (toTab) {
        return (
            <RedirectLink toDashTab={toTab || "Cliente"}>
                <ButtonFab
                    color="var(--mainWhite)"
                    backgroundColor={`var(--themeSDark--${
                        btnColor || "default"
                    })`}
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon={returnIcon}
                            style={{ ...faStyle, fontSize: "20px" }}
                        />
                    }
                />
            </RedirectLink>
        );
    }

    return (
        <div className="position-absolute" style={{ top: 15, left: 15 }}>
            {isFunc && (
                <ButtonFab
                    onClick={onClick}
                    color="var(--mainWhite)"
                    backgroundColor={`var(--themeSDark--${btnColor})`}
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
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <ButtonFab
                        color="var(--mainWhite)"
                        backgroundColor={`var(--themeSDark--${
                            btnColor || "default"
                        })`}
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
