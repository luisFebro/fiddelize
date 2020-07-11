import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList() {
    return (
        <div className="mt-3 mb-5">
            <TaskCard />
            <TaskCard />
            <TaskCard />
        </div>
    );
}