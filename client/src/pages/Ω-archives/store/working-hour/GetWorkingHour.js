import { data } from './dataWorkingHour';
import { officialWebsite, whatsapp } from '../data/dataLinks';
import parse from 'html-react-parser';
let isStoreOpened = '';

const checkTodayDay = weekDays => {
    let today = '';
    weekDays.forEach((obj, ind) => {
        let date = new Date();
        if (date.getDay() === ind) {
            today = obj.weekDay;
        }
    });
    return today;
};
let todayResult = checkTodayDay(data);

const getHours = day => {
    let openHour = 0;
    let closeHour = 0;
    data.forEach(obj => {
        if (obj.weekDay === day) {
            openHour = obj.from;
            closeHour = obj.to;
        }
    });
    return [openHour, closeHour];
};

let hourResults = getHours(todayResult);

const checking = (openHour, closeHour) => {
    isStoreOpened = true;
    const hourNow = new Date().getHours();
    let msg = '';
    let msgFalse = parse(`
                Parace que nossa loja física está fechada agora.<br />
                Deixe um recado via <a href=${whatsapp}>Whatsapp</a>...<br />
                Ou faça seu pedido a qualquer hora <a href=${officialWebsite}>por aqui mesmo!</a>`);
    if (todayResult === 'Domingo') {
        return [msgFalse, false];
    }
    if (hourNow >= openHour && hourNow < closeHour) {
        msg = parse(`
                A loja física está aberta!<br />
                Estamos entregando por toda a cidade também.`);
    } else {
        msg = msgFalse;
        isStoreOpened = false;
    }
    return [msg, isStoreOpened];
};

const dataWorkingHour = checking(hourResults[0], hourResults[1]);

export { dataWorkingHour };
