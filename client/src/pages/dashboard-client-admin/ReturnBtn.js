import React from "react";
import { useClientAdmin } from "../../hooks/useRoleData";
import { Link } from "react-router-dom";
import ButtonFab, {
    faStyle,
} from "../../components/buttons/material-ui/ButtonFab";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../redux/actions/globalActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ReturnBtn({ location, icon = "home" }) {
    const { bizCodeName } = useClientAdmin();

    const isCliAdmin = location.search === "?cliente-admin=1";

    const dispatch = useStoreDispatch();

    return (
        <div className="position-absolute" style={{ top: 15, left: 15 }}>
            {isCliAdmin && (
                <Link
                    className="no-text-decoration"
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
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
