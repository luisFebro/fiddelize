import clsx from "clsx";

export default function colorsHandler({ nps, countCliUsers }) {
    if (countCliUsers === 0) {
        return {
            colorNPS: "text-purple",
            backNPS: "theme-back--purple",
        };
    }
    const colorNPS = clsx({
        "text-red": nps < 0,
        "text-dark-yellow": nps >= 0 && nps < 30,
        "text-alt-green": nps >= 30 && nps < 70,
        "text-sys-green": nps >= 70,
    });

    const backNPS = clsx({
        "theme-back--red": nps < 0,
        "theme-back--yellow": nps >= 0 && nps < 30,
        "theme-back--green": nps >= 30,
    });

    return {
        colorNPS,
        backNPS,
    };
}
