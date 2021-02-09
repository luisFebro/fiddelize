import React from "react";
import CliWinnersCard from "./CliWinnersCard";

export default function CliWinnersList({ list, rewardDeadline }) {
    const listMap = list.map((task) => (
        <CliWinnersCard
            key={task._id}
            data={task}
            rewardDeadline={rewardDeadline}
        />
    ));

    return <div className="mt-3 mb-5">{listMap}</div>;
}
