import { useEffect } from 'react';
import { sendNotification } from '../../redux/actions/notificationActions';
import getDayMonthBr from '../../utils/dates/getDayMonthBr';
import lStorage from '../../utils/storage/lStorage';
import needAlertBirthday from '../../utils/dates/birthday/needAlertBirthday';

export default function useCustomerBirthDayToday() {
    const today = getDayMonthBr(new Date());
    const userBirthDate = lStorage("getItem", {collection: "userProfile", property: "birthday"});
    const userId = lStorage("getItem", {collection: "userProfile", property: "_id"});
    const role = lStorage("getItem", {collection: "userProfile", property: "role"});

    useEffect(() => {
        let alreadyAlerted = localStorage.getItem("alreadyBirthAlert");
        const { alert: needAlert, isBelated } = needAlertBirthday(userBirthDate, { trigger: !alreadyAlerted });

        const currYear = new Date().getFullYear();
        // making sure to clean up for the next year...
        if(alreadyAlerted) {
            const dotInd = alreadyAlerted.indexOf(".");
            const lastYear = Number(alreadyAlerted.slice(dotInd + 1));
            if(currYear > lastYear) {
                alreadyAlerted = false
                localStorage.removeItem("alreadyBirthAlert");
            }
        }

        if(needAlert && !alreadyAlerted) {
            const options = { subtype: "greeting", role: role === "cliente-admin" ? "ambos-clientes" : role, content: isBelated ? `isBelated:true;birthdayDate:${new Date()};` : `birthdayDate:${new Date()};` }
            sendNotification(userId, "birthday", options)
            .then(res => {
                if(res.status !== 200) return console.log("wrong with sendNotification")
                console.log(`${isBelated ? "BELATED BIRTHDAY" : "BIRTHDAY"}'s note sent to ${role}`);
                localStorage.setItem("alreadyBirthAlert", `true.${currYear}`)
            })
        }
    }, [today, userBirthDate])

}