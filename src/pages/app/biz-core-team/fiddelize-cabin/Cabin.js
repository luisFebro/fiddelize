import useBackColor from "../../../../hooks/useBackColor";
import GroupedDashSessions from "./GroupedDashSessions";
import ReturnBtn from "../../../../components/buttons/ReturnBtn";
import useScrollUp from "../../../../hooks/scroll/useScrollUp";

export default function Cabin({ history }) {
    useScrollUp();
    useBackColor("var(--themeP)");

    const showTitle = () => (
        <div className="mt-5">
            <h1 className="text-subtitle text-white text-center font-weight-bold">
                Cabine Fiddelize
            </h1>
            <h1
                className="text-normal text-white text-center"
                style={{
                    lineHeight: "25px",
                }}
            >
                Análise e Performance
                <br />
                do Negócio
            </h1>
        </div>
    );

    return (
        <section>
            <ReturnBtn onClick={() => history.push("/t/app/nucleo-equipe")} />
            {showTitle()}
            <br />
            <GroupedDashSessions />
        </section>
    );
}
