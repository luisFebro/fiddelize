export default function checkIfElemIsVisible(elem, setRun, needPartially = false) {
    let finalRes;
    window.onscroll = function() {
        const res = isElemVisible(elem, setRun, needPartially) ? true : false;
        finalRes = res;
    };

    function isElemVisible(elem, setRun, needPartially) {
        if(!elem) throw Error("You need to declare an element as the first parameter");

        elem = document.querySelector(elem);
        if(elem) {
            const rect = elem.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom;

            let res;
            const isTotallyVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            const isPartiallyVisible = elemTop < window.innerHeight && elemBottom >= 0;

            res = needPartially ? isPartiallyVisible : isTotallyVisible;

            setRun(res);
        }
    }
    return finalRes;
}