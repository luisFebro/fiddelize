import PrizeList from "./PrizeList";
import "./_PrizesGallery.scss";
import { useProfile } from "init";

export default function PrizesGallery({ targetId = undefined }) {
    let { userId } = useProfile();
    if (targetId) userId = targetId;

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Galeria de Prêmios
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <PrizeList userId={userId} />
        </section>
    );
}
