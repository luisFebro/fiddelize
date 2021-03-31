import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import parse from "html-react-parser";
import "./_NotifPermissionBanner.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";
import { showPermissionBanner, requestPermission } from "./pushNotifications";
import { showSnackbar } from "../../redux/actions/snackbarActions";

const permissionStatus = showPermissionBanner();

export default function NotifPermissionBanner({
    title = "Receba notificações que importam para seu negócio!",
}) {
    const [shouldRender, setShouldRender] = useState(permissionStatus);

    const dispatch = useStoreDispatch();

    const handleNotifPermission = async () => {
        const permission = await requestPermission();
        const isGranted = permission === "granted";
        const isDenied = permission === "denied";

        if (isDenied) {
            showSnackbar(
                dispatch,
                "Se precisar ativar depois, vá em ajustes > notificações",
                "warning",
                6000
            );
        }

        if (!isGranted) return;
        // subscribe user here
        setShouldRender(false);
        showSnackbar(dispatch, "Notificações ativadas!", "success");
    };

    const showTitle = () => (
        <div className="notif-text text-normal text-white">{parse(title)}</div>
    );

    const showActionBtn = () => (
        <div className="notif-close-btn animated wobble delay-5s repeat-2">
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
        <section>
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
