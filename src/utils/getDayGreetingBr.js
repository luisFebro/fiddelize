export default function getDayGreetingBr(options = {}) {
    const { lowercase = false, lateHours = true } = options;

    let greeting;
    let hourNow = new Date().getHours();
    if (hourNow >= 0 && hourNow <= 4) {
        greeting = lateHours ? "Boa Madrugada" : "Boa Noite"; // for ui fitting
    } else if (hourNow > 4 && hourNow <= 12) {
        greeting = "Bom Dia";
    } else if (hourNow > 12 && hourNow <= 17) {
        greeting = "Boa Tarde";
    } else {
        greeting = "Boa Noite";
    }

    if (lowercase) greeting = greeting.toLowerCase();

    return greeting;
}
