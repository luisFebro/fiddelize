// Choose this over BackBtn
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import { setRun, useAction } from "global-data/ui";
import ButtonFab, { faStyle } from "./material-ui/ButtonFab";
import RedirectLink from "../RedirectLink";

function ReturnBtn({
    location,
    icon = "home",
    returnIcon = "arrow-left",
    onClick,
    toAdminDash,
    btnColor = "default",
    toTab,
    style = { top: 15, left: 15 },
    zIndex,
}) {
    const { bizLinkName } = useBizData();

    const isCliAdmin = toAdminDash || location.search === "?cliente-admin=1";

    const uify = useAction();

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
                    zIndex={zIndex}
                />
            </RedirectLink>
        );
    }

    return (
        <div className="position-fixed" style={style}>
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
                    to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun("runName", "goDash", uify)}
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
