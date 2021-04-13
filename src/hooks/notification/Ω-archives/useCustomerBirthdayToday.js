import { useEffect } from "react";
import { sendNotification } from "../../redux/actions/notificationActions";
import getDayMonthBr from "../../utils/dates/getDayMonthBr";
import lStorage from "../../utils/storage/lStorage";
import { getVar, removeVar, setVar } from "../storage/useVar";
import needAlertBirthday from "./birthday/needAlertBirthday";
import { useClientAdmin } from "../useRoleData";
import useData from "../useData";

export default function useCustomerBirthDayToday() {
    const today = getDayMonthBr(new Date());
    const userBirthDate = lStorage("getItem", {
        collection: "userProfile",
        property: "birthday",
    });
    // const userBirthDate = "11 de Abril de 1994";

    const { selfBizLogoImg } = useClientAdmin();
    const [firstName, userId, role] = useData(["firstName", "userId", "role"]);

    useEffect(() => {
        if (firstName === "..." || !userId === "...") return;

        (async () => {
            const resBirthdayStatus = await getVar("alreadyBirthAlert");

            let alreadyAlerted = resBirthdayStatus;

            const { alert: needAlert } = needAlertBirthday(userBirthDate, {
                trigger: !alreadyAlerted,
            });

            const currYear = new Date().getFullYear();
            // making sure to clean up for the next year...
            if (alreadyAlerted) {
                const dotInd = alreadyAlerted.indexOf(".");
                const lastYear = Number(alreadyAlerted.slice(dotInd + 1));
                if (currYear > lastYear) {
                    alreadyAlerted = false;
                    removeVar("alreadyBirthAlert");
                }
            }

            const birthdayMsg = "a Cherie's Beauty te deseja tudo de bom";

            const pushNotifData = {
                isPushNotif: true,
                type: "birthday",
                role,
                userId,
                payload: {
                    role,
                    userName: firstName,
                    birthdayMsg,
                    bizLogo: selfBizLogoImg,
                },
                notifCard: {
                    cardType: "birthday",
                    birthdayMsg,
                },
            };

            if (needAlert && !alreadyAlerted) {
                const res = await sendNotification(
                    userId,
                    "birthday",
                    pushNotifData
                );
                if (res.status !== 200)
                    return console.log(
                        "wrong sending birthday's push notification"
                    );

                console.log(`BIRTHDAY's note sent to ${role}`);
                setVar({ alreadyBirthAlert: `true.${currYear}` });
            }

            return false;
        })();
    }, [today, role, userId, firstName, selfBizLogoImg, userBirthDate]);
}
