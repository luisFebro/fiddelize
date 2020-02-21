import React from 'react';
import { dataWorkingHour } from './working-hour/GetWorkingHour';

export default function CheckWorkingHour() {
    return (
        <div className="pt-5">
            <span>{dataWorkingHour[0]}</span>
        </div>
    );
}
