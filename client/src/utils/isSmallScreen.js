export default function isSmallScreen(customWidth) {
    const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

    const maxWidthForSmall = customWidth || 768;

    const SMALL_SCREENS = width <= maxWidthForSmall;

    return SMALL_SCREENS;
}