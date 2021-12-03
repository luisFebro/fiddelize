import zenscroll from "zenscroll";

// LESSON:
// do not use offset (in center mode) if inside an modal.
export default function scrollIntoView(thisElem, options = {}) {
    const {
        delay = 0, // ms
        mainContainer, // for scrollable div
        duration = 1500, // ms
        onDone = () => null,
        offset = 47, // only center mode
        y, // only toY mode
        mode = "center", // center, toY, to
    } = options;

    if (mainContainer) {
        // NOT WORKING ON MODALS...
        // const defaultDuration = 500;
        // const edgeOffset = 30;
        const container = document.querySelector(mainContainer);
        const target =
            typeof thisElem === "string"
                ? document.querySelector(thisElem)
                : thisElem;
        const myScroller = zenscroll.createScroller(
            container,
            duration,
            offset,
            () => onDone()
        ); // defaultDuration, edgeOffset
        // myScroller.intoView(target);
        return;
    }

    if (!thisElem)
        throw new Error(
            "You have to specify an element with # (id) or . (class)"
        );

    let elem;
    if (typeof thisElem === "object") {
        elem = thisElem;
    } else {
        if (!thisElem.includes("#"))
            throw new Error("Insert # (id) along with the element's name");
        elem = document.querySelector(thisElem);
    }

    if (elem) {
        if (mode === "intoView") {
            setTimeout(
                () => zenscroll.intoView(elem, duration, () => onDone()),
                delay
            );
        }
        if (mode === "center") {
            setTimeout(
                () => zenscroll.center(elem, duration, offset, () => onDone()),
                delay
            );
        }
        if (mode === "toY") {
            setTimeout(() => zenscroll.toY(y, duration, () => onDone()), delay);
        }
        if (mode === "to") {
            setTimeout(
                () => zenscroll.to(elem, duration, () => onDone()),
                delay
            );
        }
    }
}
