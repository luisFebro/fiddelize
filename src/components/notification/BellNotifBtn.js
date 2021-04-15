import { useState, Fragment } from "react";
import BadaloBell from "../buttons/bells/badalo/BadaloBell";
import ModalFullContent from "../modals/ModalFullContent";
import Notification from "./Notification";

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

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Comp = (
        <Notification
            forceCliUser={forceCliUser}
            totalNotif={badgeValue}
            bizId={bizId}
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
                badgeValue={badgeValue}
            />
            <ModalFullContent
                contentComp={Comp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
