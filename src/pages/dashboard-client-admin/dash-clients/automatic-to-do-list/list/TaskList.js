import TaskCard from "./TaskCard";

export default function TaskList({ list, prizeDeadline }) {
    const listMap = list.map((task) => (
        <TaskCard key={task._id} data={task} prizeDeadline={prizeDeadline} />
    ));

    return <div className="mt-3 mb-5">{listMap}</div>;
}
