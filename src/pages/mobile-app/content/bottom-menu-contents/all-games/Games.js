import useContext from "context";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
// games
import TargetPrizeGame from "./target-prize/TargetPrizeGame";
// end games
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Games() {
    const {
        selectTxtStyle,
        selectedTxtStyle,
        currChall,
        colorBack,
    } = useContext();

    const showTitle = () => (
        <section className="mb-4">
            <h2 className="animated fadeInUp text-subtitle font-weight-bold text-center">
                <SportsEsportsIcon className="mr-3" style={{ fontSize: 35 }} />
                Prêmio Alvo
            </h2>
            <p
                className={`m-0 ${selectTxtStyle(colorBack, {
                    bold: true,
                })} text-subtitle text-center d-block mb-3`}
            >
                Desafio n.º {currChall}
            </p>
        </section>
    );

    return (
        <section className={`${selectedTxtStyle}`}>
            {showTitle()}
            <TargetPrizeGame />
        </section>
    );
}
