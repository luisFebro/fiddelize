// reference: https://stackoverflow.com/questions/20015462/find-out-how-many-thousands-and-hundreds-and-tens-are-there-in-a-amount/38807562
// get remainder from multiple of ten
export default function getRemainder(type, targetNumber, eachMilestone) {
    //validation
    if(typeof targetNumber !== "number") {
        throw new Error("The second argument should be a number");
    }
    if(!["hundreds", "tens", "units"].includes(type)) {
        throw new Error("Oops! You should includes one of valid unit measures: hundreds, tens, units")
    }
    //end validation

    const metrics = {
        hundreds: 1000,
        tens: eachMilestone || 100,
        units: 10,
    }

    const chosenMetric = metrics[type];

    let remainder = targetNumber % chosenMetric;
    if(!remainder) {
        remainder = 0;
    }

    const isInteger = Number.isInteger(parseFloat(targetNumber));
    if(!isInteger) {
        remainder = remainder.toFixed(2);
    }

    return remainder;
}