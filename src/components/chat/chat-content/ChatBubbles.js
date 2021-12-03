import { Fragment } from "react";
import { calendar, getLocalHour } from "utils/dates/dateFns";

export default function ChatBubbles({ msgList = [] }) {
    return (
        <Fragment>
            <div className="chat__content pt-4 px-3">
                <ul className="chat__list-messages">
                    {msgList.map((data) => (
                        <li key={data._id}>
                            {data.isFirstDayMsg && (
                                <div className="chat__time">
                                    {calendar(data.createdAt)}
                                </div>
                            )}
                            {data.msgs.map((ms, ind) => (
                                <div
                                    key={ind}
                                    className={`chat__bubble chat__bubble--${data.bubble}`}
                                >
                                    {ms.m}
                                    <span className="chat__bubble--b-time">
                                        {getLocalHour(ms.t)}
                                    </span>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            </div>
        </Fragment>
    );
}
