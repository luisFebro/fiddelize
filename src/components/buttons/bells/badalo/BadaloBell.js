import React, { useEffect } from "react";
import NotificationBadge from "../../../NotificationBadge";
import usePlayAudio from "../../../../hooks/media/usePlayAudio";
import "./_style.scss";

const playAnima = ({ callback, isInit = null }) => {
    const animaTop = document.querySelector(".bell-top");
    const animaBottom = document.querySelector(".bell-bot");
    const class1 = isInit ? "bell-top-anim-2" : "bell-top-anim";
    const class2 = isInit ? "bell-bot-anim-2" : "bell-bot-anim";

    animaTop.classList.add(class1);
    animaBottom.classList.add(class2);

    function handleAnimationEnd() {
        animaTop.classList.remove(class1);
        animaBottom.classList.remove(class2);

        if (typeof callback === "function") callback();
    }

    animaTop.addEventListener("animationend", handleAnimationEnd);
    animaBottom.addEventListener("animationend", handleAnimationEnd);
};

export default function BadaloBell({
    position,
    notifBorderColor,
    notifBackColor,
    onClick,
    badgeValue = 0,
    top,
    right,
    left,
}) {
    // const [badgeInvisible, setbadgeInvisible] = useState(false);

    usePlayAudio(
        "/sounds/bell-small-hand-single-ring-ping-very-high-pitched.mp3",
        ".badalo-bell--audio"
    );

    useEffect(() => {
        let startPlayAnima;
        if (badgeValue) {
            startPlayAnima = setTimeout(
                () => playAnima({ isInit: true }),
                3000
            );
        }
        // cleanup function
        return () => {
            clearTimeout(startPlayAnima);
        };
    }, [badgeValue]);

    const handleBadaloClick = () => {
        playAnima({ callback: onClick });
    };

    // When passing props as a child,should wrapped like this to avoid rerender
    const notifBody = React.useMemo(
        () => (
            <NotificationBadge
                badgeValue={badgeValue}
                badgeInvisible={false}
                backgroundColor={notifBackColor}
                borderColor={notifBorderColor}
                top={20}
                onClick={handleBadaloClick}
            >
                <div className="bell" onClick={handleBadaloClick}>
                    <div className="bell-top" />
                    <div className="bell-bot" />
                </div>
            </NotificationBadge>
        ),
        [badgeValue]
    );

    // LESSON: if position is absolute, the bell is clickable only in a specific area in the top.
    return (
        <section
            className="badalo-bell--audio"
            style={{ position, top, right, left, cursor: "pointer" }}
            onClick={handleBadaloClick}
        >
            {notifBody}
        </section>
    );
}

// BadaloBell.whyDidYouRender = false;
