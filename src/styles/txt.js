// use it only for selecting text's color if the background is not the themeBackColor defined by user like themeSColor which requires to pass that color.
export default function getColor(backColor) {
    const backColorsNeedDark = ["yellow", "white"];
    const needDark = backColorsNeedDark.includes(backColor);

    const lightTxt = "text-white text-shadow";
    const darkTxt = "text-black font-weight-bold";

    return {
        needDark,
        txtColor: needDark ? darkTxt : lightTxt,
        txtColorStyle: needDark ? "black" : "var(--mainWhite)",
    };
}
