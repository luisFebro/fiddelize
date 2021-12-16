import { Fragment } from "react";
import { calendar, getLocalHour } from "utils/dates/dateFns";
import getItems from "init/lStorage";

const [chatUserId] = getItems("global", ["chatUserId"]);

export default function ChatBubbles({ msgList = [] }) {
    return (
        <Fragment>
            <div className="chat__content pt-4 px-3 pb-5">
                <ul className="position-relative chat__list-messages">
                    {!msgList.length
                        ? []
                        : removeObjDuplicate({ list: msgList }).map((data) => {
                              const { from, content } = data;
                              const bubble = pickBubble({ from });
                              const {
                                  msgId,
                                  msgDate,
                                  firstMsgTodayDate,
                                  msg,
                              } = content;

                              return (
                                  <li key={msgId} className="position-relative">
                                      {from === "Fidda Bot" && (
                                          <div
                                              className="position-absolute animated delay-2s fadeInUp"
                                              style={{
                                                  top: -10,
                                                  left: -23,
                                                  zIndex: 1000,
                                              }}
                                          >
                                              <img
                                                  width={50}
                                                  src="/img/icons/fiddelize-fiddabot.svg"
                                                  alt="altrabot"
                                              />
                                          </div>
                                      )}
                                      {firstMsgTodayDate && (
                                          <div className="chat__time">
                                              {calendar(firstMsgTodayDate)}
                                          </div>
                                      )}
                                      <div
                                          className={`chat__bubble chat__bubble--${bubble} shadow-field`}
                                      >
                                          {msg && msg.trim()}
                                          <span
                                              className="chat__bubble--b-time"
                                              style={{
                                                  color:
                                                      bubble === "me"
                                                          ? "grey"
                                                          : "white",
                                              }}
                                          >
                                              {getLocalHour(msgDate)}
                                          </span>
                                      </div>
                                  </li>
                              );
                          })}
                </ul>
            </div>
        </Fragment>
    );
}

// HELPERS
function removeObjDuplicate({ list = [], filterId = "msgId", newObj }) {
    // originalArr - The array on which filter() was called.
    // findIndex - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
    if (!list || !list.length) return [];
    const finalList = !newObj ? list : [...list, newObj];

    return finalList.filter(
        (item1, ind, originalArr) =>
            originalArr.findIndex(
                (item2) => item2.content[filterId] === item1.content[filterId]
            ) === ind // if find the item, returns its ind which should be the same as filter method, then we can remove duplicates.
    );
}

function pickBubble({ from }) {
    const isBot = from === "Fidda Bot";
    if (isBot) return "other";

    const isCurrUserMsg = from === chatUserId;

    const currBubble = isCurrUserMsg ? "me" : "other";
    return currBubble;
}
// END HELPERS
