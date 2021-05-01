import getVar from "init/var";
import { getServiceSKU } from "../string/getSKUCode.js";

export default function setProRef({ setData, planBr, period }) {
    getVar("totalServices_clientAdmin").then((totalServ) => {
        const thisCode = getServiceSKU({
            plan: planBr,
            total: totalServ || 1,
            period,
        });
        // if you want to access data inside of a promise, use innerData, never external data because it returns undefined.
        setData((innerData) => ({ ...innerData, SKU: thisCode }));
    });
}
