import { useState, Fragment } from "react";
import BadaloBell from "../buttons/bells/badalo/BadaloBell";
import ModalFullContent from "../modals/ModalFullContent";
import LoadableVisible from "../code-splitting/LoadableVisible";

const AsyncNotification = LoadableVisible({
    loader: () =>
        import("./Notification" /* webpackChunkName: "notif-full-page-lazy" */),
});

export default function BellNotifBtn({
    position = "relative",
    top,
    left,
    right,
    notifBorderColor,
    notifBackColor,
    badgeValue,
    forceCliUser,
    needClick = true,
    bizId,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [needEmptyBadge, setNeedEmptyBadge] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
        setNeedEmptyBadge(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Comp = (
        <AsyncNotification
            forceCliUser={forceCliUser}
            totalNotif={badgeValue}
            bizId={bizId}
            closeNotifModal={handleFullClose}
        />
    );

    return (
        <Fragment>
            <BadaloBell
                onClick={needClick ? handleFullOpen : null}
                position={position}
                top={top}
                left={left}
                right={right}
                notifBorderColor={notifBorderColor}
                notifBackColor={notifBackColor}
                badgeValue={needEmptyBadge ? 0 : badgeValue}
            />
            <ModalFullContent
                contentComp={Comp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
