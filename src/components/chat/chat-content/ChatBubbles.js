import { Fragment } from "react";
import { calendar, getLocalHour } from "utils/dates/dateFns";

export default function ChatBubbles({ msgList = [] }) {
    return (
        <Fragment>
            <div className="chat__content pt-4 px-3 pb-5">
                <ul className="position-relative chat__list-messages">
                    {!msgList.length
                        ? []
                        : msgList.map((data) => (
                              <li key={data.msgId}>
                                  {data.isFirstMsgToday && (
                                      <div className="chat__time">
                                          {calendar(data.firstMsgTodayDate)}
                                      </div>
                                  )}
                                  <div
                                      className={`chat__bubble chat__bubble--${data.bubble} shadow-field`}
                                  >
                                      {data.msg && data.msg.trim()}
                                      <span
                                          className="chat__bubble--b-time"
                                          style={{
                                              color:
                                                  data.bubble === "me"
                                                      ? "grey"
                                                      : "white",
                                          }}
                                      >
                                          {getLocalHour(data.msgDate)}
                                      </span>
                                  </div>
                              </li>
                          ))}
                </ul>
            </div>
        </Fragment>
    );
}
