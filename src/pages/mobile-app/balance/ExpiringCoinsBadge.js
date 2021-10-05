import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Tooltip from "components/tooltips/Tooltip";
import NotificationBadge from "components/badges/NotificationBadge";
import useData, { useBizData } from "init";
import getItems, { setItems } from "init/lStorage";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

// display only once when switching between the two until user realize he/she can just click on the button to open it.
const [alreadyExpCoinsOn, alreadyExpCoinsOff] = getItems("onceChecked", [
    "alreadyExpCoinsOn",
    "alreadyExpCoinsOff",
]);

export default function ExpiringCoinsBadge() {
    const [open, setOpen] = useState(false);
    const { currPoints, firstName } = useData();

    let { expiringCoinsOn } = useBizData();
    const { expiringCoinsDate: expiringDateAdmin } = useBizData();
    const { expiringCoinsDate: expiringCoinsDateUser } = useData();
    // if there is a user register expirationDate, then it means the customer was registered after the activation of this func, then having a different (most recent) date and thusly having priority over adim starting date
    const daysLeftExpireCoins = getDatesCountdown(
        expiringCoinsDateUser || expiringDateAdmin
    );

    // the expiringCoinsOn is also active if there is still a custom expiration date because the expiration is independent and will still running if cli-user doesn't deactivate and it was the system instead.
    expiringCoinsOn = Boolean(expiringCoinsOn || expiringCoinsDateUser);

    useEffect(() => {
        let runTimeout;

        const showTooltipOnce = () => {
            runTimeout = setTimeout(() => {
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 10000);
            }, 15000);
        };

        if (!alreadyExpCoinsOn) {
            if (expiringCoinsOn) showTooltipOnce();
            setItems("onceChecked", {
                alreadyExpCoinsOn: expiringCoinsOn,
            });
        }

        if (!alreadyExpCoinsOff) {
            if (!expiringCoinsOn) showTooltipOnce();
            setItems("onceChecked", {
                alreadyExpCoinsOff: !expiringCoinsOn,
            });
        }

        return () => clearTimeout(runTimeout);
    }, [expiringCoinsOn]);

    const BadgeIcon = (
        <div>
            <NotificationBadge
                badgeValue={!expiringCoinsOn ? 0 : daysLeftExpireCoins || 0}
                badgeInvisible
                backgroundColor="var(--mainRed)"
                borderColor="var(--mainWhite)"
                top={-1}
                right={5}
                fontSize="15px"
                padding="12px"
                animationName=""
            >
                <ButtonFab
                    position="relative"
                    onClick={() => setOpen((prev) => !prev)}
                    size="small"
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon="clock"
                            style={{ fontSize: 25 }}
                        />
                    }
                    backgroundColor="var(--niceUiYellow)"
                    iconToLeft
                    needBtnShadow={false}
                    shadowColor="#fff"
                />
            </NotificationBadge>
        </div>
    );

    const expiringMsg = expiringCoinsOn
        ? `${firstName}, seu saldo de ${currPoints} PTS expira em ${daysLeftExpireCoins} dias. Aproveite para acumular moedas PTS e trocar por benefícios durante o período. Boas compras!`
        : `Ei ${firstName}, suas moedas digitais não tem prazo para expirar. Acumule moedas e ganhe benefícios!`;

    return (
        <section>
            <Tooltip
                text={expiringMsg}
                hover
                onClickAway={() => setOpen(false)}
                padding="10px"
                arrowBottom="4px !important"
                whiteSpace
                width={325}
                needArrow
                needOpen={open}
                color="var(--mainWhite)"
                backgroundColor="var(--mainDark)"
                element={BadgeIcon}
            />
        </section>
    );
}
