import CartRace from "./cart-race/CartRace";

const isEvenSmall = window.Helper.isSmallScreen(415);

export default function DiscountBack({ didUserScroll }) {
    const currScore = 30;
    const userName = "Febro";

    const showCartRace = () =>
        isEvenSmall && (
            <CartRace
                className="animated zoomIn faster"
                currUserScore={currScore}
                userName={userName}
            />
        );

    return <section>{showCartRace()}</section>;
}
