// for className and align text correctly across devices.
const isSmall = window.Helper.isSmallScreen();
export const fluidTextAlign = `${isSmall ? "ml-2 text-left" : "text-center"}`;