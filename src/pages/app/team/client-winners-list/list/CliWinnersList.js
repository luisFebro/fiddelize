import CliWinnersCard from "./CliWinnersCard";

export default function CliWinnersList({ list, prizeDeadline }) {
    const listMap = list.map((task) => (
        <CliWinnersCard
            key={task._id}
            data={task}
            prizeDeadline={prizeDeadline}
        />
    ));

    return <div className="mt-3 mb-5">{listMap}</div>;
}
