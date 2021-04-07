import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import parse from "html-react-parser";
import "./_NotifPermissionBanner.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";
import requestPermission, { showPermissionBanner } from "./pushNotifPermission";
import useData from "../../hooks/useData";

const permissionStatus = showPermissionBanner();

export default function NotifPermissionBanner({ title = "", subtitle = "" }) {
    const [backDrop, setBackDrop] = useState(false);
    const [shouldRender, setShouldRender] = useState(permissionStatus);

    const dispatch = useStoreDispatch();

    const [userId, role] = useData(["userId", "role"]);

    const handleNotifPermission = async () => {
        if (userId === "...") return;
        setShouldRender(false);
        setBackDrop(true);
        await requestPermission({
            dispatch,
            setShouldRender,
            setBackDrop,
            userId,
            role,
        });
    };

    const showTitle = () => (
        <div
            className="py-2 notif-text font-site text-white"
            style={{
                lineHeight: "20px",
            }}
        >
            <span className="d-block text-center font-weight-bold">
                {parse(title)}
            </span>
            <span className="text-em-0-9">{parse(subtitle)}</span>
        </div>
    );

    const showActionBtn = () => (
        <div className="notif-close-btn">
            <ButtonMulti
                title="ativar"
                onClick={handleNotifPermission}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
            />
        </div>
    );

    return (
        <section className={backDrop ? "backdrop-medium" : ""}>
            {shouldRender ? (
                <div className="notif-permission-banner animated fadeInUp">
                    <div className="notif-content">
                        <FontAwesomeIcon icon="bell" className="notif-icon" />
                        {showTitle()}
                    </div>
                    {showActionBtn()}
                </div>
            ) : null}
        </section>
    );
}
