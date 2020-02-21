export default function getDayGreetingBr() {
    let greeting;
    let hourNow = new Date().getHours();
    if (hourNow >= 0 && hourNow <= 4) {
        greeting = "Boa Madrugada";
    } else if (hourNow > 4 && hourNow <= 12) {
        greeting = "Bom Dia";
    } else if (hourNow > 12 && hourNow <= 17) {
        greeting = "Boa Tarde";
    } else {
        greeting = "Boa Noite";
    }
    return greeting;
}
