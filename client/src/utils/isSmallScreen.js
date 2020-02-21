export default function isSmallScreen() {
    const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

    const SMALL_SCREENS = width <= 768;

    return SMALL_SCREENS;
}