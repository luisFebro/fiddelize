import React, { useEffect, useState } from 'react';
import NotificationBadge from '../../../NotificationBadge';
import './style.scss';

export default function BadaloBell({
    position,
    notifBorderColor,
    notifBackColor,
    badgeValue,
    top,
    right,
    left,
}) {

    const [badgeInvisible, setbadgeInvisible] = useState(false);

    const playAnima = (options = {}) => {
        const { callback, isInit } = options;

        const animaTop = document.querySelector(".bell-top");
        const animaBottom = document.querySelector(".bell-bot");
        const class1 = isInit ? 'bell-top-anim-2' : 'bell-top-anim';
        const class2 = isInit ? 'bell-bot-anim-2' : 'bell-bot-anim';

        animaTop.classList.add(class1)
        animaBottom.classList.add(class2)

        function handleAnimationEnd() {
            animaTop.classList.remove(class1);
            animaBottom.classList.remove(class2);

            if (typeof callback === 'function') callback()
        }

        animaTop.addEventListener('animationend', handleAnimationEnd)
        animaBottom.addEventListener('animationend', handleAnimationEnd)

    };

    useEffect(() => {
        badgeValue && setTimeout(() => playAnima({ isInit: true }), 3000);
    }, [badgeValue])

    return (
        <section
            style={{ position, top, right, left }}
            onClick={() => playAnima({callback: () => setbadgeInvisible(true) })}
        >
            <NotificationBadge
                badgeValue={badgeValue}
                badgeInvisible={badgeInvisible}
                backgroundColor={notifBackColor}
                borderColor={notifBorderColor}
                top={20}
            >
                <div class="bell">
                    <div class="bell-top"></div>
                    <div class="bell-bot"></div>
                </div>
            </NotificationBadge>
        </section>
    );
}