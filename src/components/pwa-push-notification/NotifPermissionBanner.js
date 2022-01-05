import { useState } from "react";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData from "init";
import { IS_STAGING } from "api/root";
import "./_NotifPermissionBanner.scss";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";
import requestPermission, { showBanner } from "./pushNotifPermission";

const permissionStatus = showBanner;

export default function NotifPermissionBanner({ title = "", subtitle = "" }) {
    const [backDrop, setBackDrop] = useState(false);
    const [shouldRender, setShouldRender] = useState(permissionStatus);

    const [userId, role] = useData(["userId", "role"]);

    const handleNotifPermission = async () => {
        if (userId === "...") return;
        setShouldRender(false);
        setBackDrop(true);
        await requestPermission({
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

    // don`t show the notif comp while in staging because it will conflict with current app and update incorrectly to the test env app
    if (IS_STAGING) return <div />;

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
