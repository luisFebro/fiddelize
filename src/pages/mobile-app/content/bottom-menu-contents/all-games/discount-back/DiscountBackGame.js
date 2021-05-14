import useData, { useBizData } from "init";
import GamesGalleryBtn from "../games-gallery-btn/GamesGalleryBtn";
import CartRace from "./cart-race/CartRace";

export default function DiscountBackGame({ didUserScroll }) {
    const { firstName } = useData();
    const { themeSColor: colorS, themeBackColor: colorBack } = useBizData();

    const showCartRace = () => (
        <CartRace className="animated fadeInUp faster" userName={firstName} />
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
