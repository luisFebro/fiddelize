const backColorsWhichNeedDarkTxt = ["yellow", "white"];

export default function selectTxtStyle(
    backgroundColor = "default",
    options = {}
) {
    const { bold, needDarkBool, needShadow, mode = "className" } = options;
    const array = backColorsWhichNeedDarkTxt;
    const needDark = array.some(
        (item) => backgroundColor && backgroundColor.includes(item)
    );

    const whiteTheme = "text-white text-shadow";
    let darkTheme = "text-black";

    if (bold) {
        darkTheme += " font-weight-bold";
    }

    if (mode === "style") {
        if (needDark) {
            return {
                color: "var(--mainBlack)",
                textShadow: "1px 1px 3px black",
            };
        }
        return {
            color: "var(--mainWhite)",
            textShadow: undefined,
        };
    }

    if (needDarkBool) return !!needDark;
    if (needShadow) return !needDark;
    return needDark ? darkTheme : whiteTheme;
}

const currTxtColor = (backColor) =>
    selectTxtStyle(backColor, { needDarkBool: true })
        ? "var(--mainDark)"
        : "var(--mainWhite)";
export { currTxtColor };
