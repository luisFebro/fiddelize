import { Fragment } from "react";
import { fromNow } from "utils/dates/dateFns";

export default function ChatBubbles({ msgList = [] }) {
    return (
        <Fragment>
            <div className="chat__content pt-4 px-3">
                <ul className="chat__list-messages">
                    {msgList.map((data) => (
                        <li key={data._id}>
                            {data.isFirstDayMsg && (
                                <div className="chat__time">
                                    {fromNow(data.createdAt)}
                                </div>
                            )}
                            {data.msgs.map((msg, ind) => (
                                <div
                                    key={ind}
                                    className={`chat__bubble chat__bubble--${data.bubble}`}
                                >
                                    {msg}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            </div>
        </Fragment>
    );
}
