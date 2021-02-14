import parse from "html-react-parser";
import { greetings } from "../data/dataIllustrations";

export default function getPeriodOfDayWithPic(nameUser) {
    const name = nameUser || "visitante";
    const hourNow = new Date().getHours();
    const res = {
        greeting: "",
        illustration: {
            img: "",
            color: "var(--mainYellow)",
            alt: "",
        },
    };
    if (hourNow >= 0 && hourNow <= 4) {
        res.greeting = parse(`Boa Madrugada,<br />${name}!`);
        res.illustration.img = greetings.earlyHours.img;
        res.illustration.alt = greetings.earlyHours.alt;
    } else if (hourNow > 4 && hourNow <= 12) {
        res.greeting = parse(`Bom Dia,<br /> ${name}!`);
        res.illustration.img = greetings.morning.img;
        res.illustration.alt = greetings.morning.alt;
    } else if (hourNow > 12 && hourNow <= 17) {
        res.greeting = `Boa Tarde, ${name}!`;
        res.illustration.img = greetings.afternoon.img;
        res.illustration.alt = greetings.afternoon.alt;
    } else {
        res.greeting = parse(`Boa Noite,<br /> ${name}!`);
        res.illustration.img = greetings.night.img;
        res.illustration.alt = greetings.night.alt;
    }
    return res;
}
