import GamesGalleryBtn from "./games-gallery-btn/GamesGalleryBtn";

export default function GameCTAs(props) {
    return (
        <section className="animated fadeInUp delay-2s my-5 container-center">
            <GamesGalleryBtn {...props} />
        </section>
    );
}
