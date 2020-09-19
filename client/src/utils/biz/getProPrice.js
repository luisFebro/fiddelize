import getRemainder from "../numbers/getRemainder";

/*
PRICING SYSTEM
Fiddelize's Services Price Building
*/

// note/weight range: 5 - 20
// 1 weight for a year = R$ 100.
// 1 weight for a month = R$ 10.

/*

FEATURES
1. timeDevGrade also Difficulty to build
2. Comsumption of resource (database request, database space, server)
3. Active Client's Base group - (default 30)

LABEL
the yearly and monthly brazilian real values.

FORMULA:
P = Highest Price with no discount (Meu Bronze)
Dev = Time or Difficulty to develop the service (10 - 20).
Res = Comsumption of Resource (10 - 20).
Val = Value per weight R$ 100
Cli = Active Client's Base group
Dis = Fixed Discount between plans for each service. (R$ 10)
Meu Bronze = R$ 0 discount
Prata = R$ 10 discount
Gold = R$ 20 discount

P = (Dev x Val) + (Res x Val) / Cli
P = P - Dis

NOTES:
1. If the client decide to pay per month, there will be 10% more comparing to yearly period since a year has 12 monthes.
2. Minimum value is R$ 5 with maximum discount and maximum value is R$ 135 per service.
3. The price for each customer is regulated on the market.
4. Weight five is the default minimum weight because we can discount up until 3 times between the plan before the value gets negative due to substraction like the sequence: R$ 15, R$ 5, R$ -5
5. The most complete plan (gold plan) reach its maximum price based on the market highest plan based (R$ 1.490) with alike number of features
6. Competition Benchmarking is used for:
a) Regulate the maximum price for the most complete plan;
b) Get the value paid by customer based on the total of the most complete plan divided by the number of customer's registration.
7. Two possible unit values for simplicity:
For yearly Period:
if the unit's value is below or equal to 5, then 5. Otherwise goes to the next decimal
56, 57, 57.33 goes to 60.

For monthly Period:
it is always 10% from the yearly value.
exemple:
R$ 150 yearly, R$ 15 montly
R$ 135 yearly, R$ 13.5 montly

Then, the client will pay 20% more comparing to yearly period if paid monthly during a year.
8. Minimum purchase value to compensate taxes is R$ 28.
*/

function getSimplifiedUnit(p) {
    const unit = getRemainder("units", p);

    const needHundred = parseInt(p).toString().length >= 3;

    const needFive = unit <= 5;

    const firstNum = needHundred
        ? p.toString().charAt(1)
        : p.toString().charAt(0);
    if (needFive) {
        p = Number(`${firstNum}5`);
        p = needHundred ? Number(`1${firstNum}5`) : Number(`${firstNum}5`);
    } else {
        const nextDecimal = Number(firstNum.toString().charAt(0)) + 1;
        p = needHundred
            ? Number(`1${nextDecimal}0`)
            : Number(`${nextDecimal}0`);
    }

    return p;
}

export default function getProPrice(
    timeDevGrade,
    resourceGrade,
    { plan = "gold", period = "yearly" }
) {
    const MIN_GRADE = 10;
    if (timeDevGrade < MIN_GRADE || resourceGrade < MIN_GRADE)
        return console.log("minimum weight/note should be 10");
    if (!plan) return console.log("Need a plan: gold, silver, bronze");
    if (!period) return console.log("Need a period: monthly, yearly");

    const UNIT_PRICE_BY_GRADE = 100;
    const MONTHLY_UNIT = 0.1;
    const BRONZE_DIS = 0;
    const SILVER_DIS = 10;
    const GOLD_DIS = 20;
    const CLI = 30;

    const unitPrice = UNIT_PRICE_BY_GRADE;

    const handleDiscount = () => {
        if (plan === "gold") return GOLD_DIS;
        if (plan === "silver") return SILVER_DIS;
        if (plan === "bronze") return BRONZE_DIS;
    };
    const selectedDiscount = handleDiscount();

    const devPer = timeDevGrade * unitPrice;
    const resPer = resourceGrade * unitPrice;

    let p = (devPer + resPer) / CLI;
    p = p - selectedDiscount;

    p = getSimplifiedUnit(p);

    if (period === "monthly") p = p * MONTHLY_UNIT;

    return p;
}

// const res = getPrice(10, 10, { plan: "gold", period: "monthly" })
// console.log("res", res) => 5
