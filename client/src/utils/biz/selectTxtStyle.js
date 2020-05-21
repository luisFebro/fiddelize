const backColorsWhichNeedDarkTxt = ["yellow", "white"];

export default function selectTxtStyle(backgroundColor = "default", options = {}) {
    const { bold, needDarkBool } = options;
    const array = backColorsWhichNeedDarkTxt;
    const needDark = array.some(item => backgroundColor.includes(item));

    let whiteTheme = "text-white text-shadow";
    let darkTheme = "text-black";

    if(bold) { darkTheme += " font-weight-bold" };

    if(needDarkBool) return needDark ? true : false;
    return needDark ? darkTheme : whiteTheme;
}