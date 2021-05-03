import useContext from "context";
import GamesGalleryBtn from "../games-gallery-btn/GamesGalleryBtn";
import CartRace from "./cart-race/CartRace";
const isEvenSmall = window.Helper.isSmallScreen(415);

export default function DiscountBackGame({ didUserScroll }) {
    const { colorS, colorBack, userName, currPoints } = useContext();

    const showCartRace = () =>
        isEvenSmall && (
            <CartRace
                className="animated fadeInUp faster"
                currUserScore={currPoints}
                userName={userName}
            />
        );

    return (
        <section>
            {showCartRace()}
            {didUserScroll && (
                <section className="my-5 container-center">
                    <GamesGalleryBtn colorS={colorS} colorBack={colorBack} />
                </section>
            )}
        </section>
    );
}
