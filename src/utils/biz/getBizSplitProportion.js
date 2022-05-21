import getPercentage from "../numbers/getPercentage";
/* INCOME/SALE SPLIT PROPORTION

WARNING: changes here should also be made in the BACKEND same method.

- Possible earnings for each job:
dev-fiddelize - 100% (solo income/sale) and/or 60% (each from his/her rep-comercials income/sales)
rep-comercial - 40% (solo income/sale) and/or 10% (each from his/her associate members income/sales)
associado - 30%

- Possible Combinations of earnings' proportion
dev-fiddelize - 100%
dev-fiddelize (60%) + rep-comercial (40%)
dev-fiddelize (60%) + rep-comercial (10%) + associado (30%)

- Possible Combinations for roles
# primaryAgent defines the earnings' proportion
- if (primaryAgent === dev-fiddelize) then (job === "dev")
- if (primaryAgent === fiddelize) then (job === "rep-comercial")
- if (primaryAgent !== fiddelize) then (job === "associado") // primaryAgent should be the req-commercial's uniqueLinkId
*/

// return the percentage (number) for current job

export default function getBizSplitProportion(primaryAgent, options = {}) {
    const {
        amount, // totalSaleAmount
    } = options;

    if (!primaryAgent) return "ERROR: primaryAgent argument missing";

    if (primaryAgent === "dev-fiddelize") {
        const proportionAmount = amount
            ? getProportionValue(amount, "dev-fiddelize")
            : undefined;

        return {
            job: "dev",
            perc: {
                dev: 100,
            },
            ...proportionAmount,
        };
    }

    if (primaryAgent === "fiddelize") {
        const proportionAmount = amount
            ? getProportionValue(amount, "fiddelize")
            : undefined;

        return {
            job: "rep-comercial",
            perc: {
                dev: 60,
                "rep-comercial": 40,
            },
            ...proportionAmount,
        };
    }

    // primary Agent is the uniqueLinkId here
    const proportionAmount = amount
        ? getProportionValue(amount, primaryAgent)
        : undefined;
    return {
        job: "associado",
        perc: {
            dev: 60,
            "rep-comercial": 10,
            associado: 30,
        },
        ...proportionAmount,
    };
}

/* TEST EXAMPLE
const res = getBizSplitProportion("luana", { amount: 100 });
res = { job: 'associado',
  perc: { dev: 60, 'rep-comercial': 10, associado: 30 },
  value:
   { dev: '60.00', 'rep-comercial': '10.00', associado: '30.00' } }
 */

function getProportionValue(amount, primaryAgent) {
    let dataproportion;
    switch (primaryAgent) {
        case "dev-fiddelize":
            dataproportion = {
                dev: amount,
            };
            return {
                value: dataproportion,
            };
        case "fiddelize":
            dataproportion = {
                dev: getPercentage(amount, 55, { mode: "value" }).toFixed(2),
                "rep-comercial": getPercentage(amount, 45, {
                    mode: "value",
                }).toFixed(2),
            };
            return {
                value: dataproportion,
            };
        default:
            dataproportion = {
                dev: getPercentage(amount, 55, { mode: "value" }).toFixed(2),
                "rep-comercial": getPercentage(amount, 15, {
                    mode: "value",
                }).toFixed(2),
                associado: getPercentage(amount, 30, { mode: "value" }).toFixed(
                    2
                ),
            };
            return {
                value: dataproportion,
            };
    }
}
