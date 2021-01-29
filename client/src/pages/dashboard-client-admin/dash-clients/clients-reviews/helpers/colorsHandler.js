import clsx from "clsx";

export default function colorsHandler({ nps, xpScore }) {
    const colorNPS = clsx({
        "text-purple": nps === 0,
        "text-red": nps < 0,
        "text-dark-yellow": nps > 0 && nps < 30,
        "text-alt-green": nps >= 30 && nps < 70,
        "text-sys-green": nps >= 70,
    });

    const backNPS = clsx({
        "theme-back--red": nps < 0,
        "theme-back--yellow": nps >= 0 && nps < 30,
        "theme-back--green": nps >= 30,
    });

    const colorXP = clsx({
        "text-sys-green": xpScore > 5,
        "text-red": xpScore <= 5,
    });

    const backXP = clsx({
        "theme-back--green": xpScore > 5,
        "theme-back--red": xpScore <= 5,
    });

    return {
        colorNPS,
        backNPS,
        colorXP,
        backXP,
    };
}
