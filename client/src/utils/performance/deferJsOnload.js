// reference: https://varvy.com/pagespeed/defer-loading-javascript.html
/*
Many people say "just use defer" or "just use async" or others say "just put your javascript at bottom of page" but none of those solve the problem of actually allowing a webpage to fully load and then (and only then) loading external JS. Nor will they get you past that "Defer loading of javascript" warning you are getting from the Google page speed tool. This solution will.
 */

// deferring js render-blocking for performance.
// ELEM is the target element either a src url or a function with component(s) or a function with instances (e.g ()=> {runComp(); runThat();}).
// MODE can be "func" (function with component(s)) or "url" (link)
export default function deferJsOnload(elem, mode, options = {}) {
    const invalidMode = !(["func", "url"]).includes(mode);
    if(!elem) throw new Error("An elem is required. it can be either a src url or a component")
    if(invalidMode) throw new Error("Invalid mode. Only comp or url allowed.")

    const { integrity, crossorigin } = options;

    const appendElem = () => {
        if(mode === "url") {
            const element = document.createElement("script");

            element.src = elem;
            if(integrity) element.integrity = integrity;
            if(crossorigin) element.crossOrigin = crossorigin;

            document.body.appendChild(element);
        } else {
            return elem();
        }
    }

    if (window.addEventListener) {
        window.addEventListener("load", appendElem, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", appendElem);
    } else window.onload = appendElem;

}

// e.g
/*
deferJsOnload(
    "https://cdn.jsdelivr.net/npm/pwacompat@2.0.10/pwacompat.min.js",
    'url',
    {
        integrity: "sha384-I1iiXcTSM6j2xczpDckV+qhhbqiip6FyD6R5CpuqNaWXvyDUvXN5ZhIiyLQ7uuTh",
        crossorigin: "anonymous",
    });
 */
