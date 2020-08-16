import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ list, rewardDeadline }) {

    const listMap = list.map(task => (
        <TaskCard
            key={task._id}
            data={task}
            rewardDeadline={rewardDeadline}
        />
    ))

    return (
        <div className="mt-3 mb-5">
            {listMap}
        </div>
    );
}