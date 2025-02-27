import { Fragment, useEffect, useState } from "react";
import { calendar, getLocalHour } from "utils/dates/dateFns";
import getItems from "init/lStorage";
import ModalFullContent from "components/modals/ModalFullContent";
import parse from "html-react-parser";
import PushNotifActivate from "./chat-funcs/PushNotifActivate";

const [chatUserId, chatRole] = getItems("global", ["chatUserId", "chatRole"]);

export default function ChatBubbles({ msgList = [], saveNewMsg }) {
    return (
        <Fragment>
            <div className="chat__content pt-4 px-3 pb-5">
                <ul className="position-relative chat__list-messages">
                    {!msgList.length
                        ? []
                        : removeObjDuplicate({ list: msgList }).map((data) => {
                              const { from, content } = data;
                              const {
                                  msgId,
                                  msgType,
                                  firstMsgTodayDate,
                              } = content;

                              return (
                                  <li key={msgId} className="position-relative">
                                      {from === "Fidda Bot" &&
                                          msgType !== "func" && (
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
                                      {firstMsgTodayDate &&
                                          msgType !== "func" && (
                                              <div className="chat__time text-nowrap">
                                                  {calendar(firstMsgTodayDate)}
                                              </div>
                                          )}
                                      <SelectedMsgType
                                          data={data}
                                          saveNewMsg={saveNewMsg}
                                          msgList={msgList}
                                      />
                                  </li>
                              );
                          })}
                </ul>
            </div>
        </Fragment>
    );
}

// COMP
function SelectedMsgType({ data, saveNewMsg, msgList }) {
    const [openImage, setOpenImagem] = useState(false);
    const { from, content } = data;

    const handleFullClose = () => {
        setOpenImagem(false);
    };

    const { msgType, msgDate, msg } = content;
    const isImg = msgType === "img";
    const isFunc = msgType && msgType === "func";

    const bubble = pickBubble({ from });

    // TYPES
    const finalTxt = parse(urlify(msg && msg.trim()));
    const text = (
        <div className={`chat__bubble chat__bubble--${bubble} shadow-field`}>
            {finalTxt}
            <span
                className="chat__bubble--b-time"
                style={{
                    color: bubble === "me" ? "grey" : "white",
                }}
            >
                {getLocalHour(msgDate)}
            </span>
        </div>
    );

    const img = (
        <div
            onClick={() => setOpenImagem(msg)}
            className={`position-relative chat__bubble chat__bubble--${bubble} chat__img shadow-field`}
        >
            <img
                src={msg}
                height="auto"
                minHeight={100}
                width={250}
                style={{
                    cursor: "pointer",
                }}
                alt="imagem suporte fiddelize"
            />
            <span
                className="text-pill text-nowrap bubble-img-timer position-absolute"
                style={{
                    bottom: 10,
                    right: 10,
                    color: "white",
                }}
            >
                {getLocalHour(msgDate)}
            </span>
            <style jsx>
                {`
                    .bubble-img-timer {
                        font-size: 12px;
                        background-color: rgba(26, 26, 26, 0.67);
                    }

                    .chat__img {
                        min-height: 100px;
                        padding: 5px !important;
                    }

                    .chat__img img {
                        border-radius: 15px;
                    }
                `}
            </style>
            {openImage && (
                <ModalFullContent
                    contentComp={
                        <FullImg closeImg={handleFullClose} src={openImage} />
                    }
                    fullOpen={openImage}
                    setFullOpen={handleFullClose}
                    backgroundColor="transparent"
                    overflowY="hidden"
                />
            )}
        </div>
    );
    if (isImg) return img;

    if (isFunc && msg === "func:pushNotif")
        return (
            <PushNotifActivate
                userId={chatUserId}
                role={chatRole}
                saveNewMsg={saveNewMsg}
                msgList={msgList}
            />
        );

    return text;
}

function FullImg({ src, closeImg }) {
    useEffect(() => {
        document.body.addEventListener("click", closeImg, true);
    }, []);

    return (
        <section className="chat-full-img enabledLink">
            <img
                src={src}
                className="animated fadeInUp"
                alt="imagem inteira chat"
                style={{
                    cursor: "pointer",
                }}
                width="100%"
                height="auto"
            />
            <style jsx>
                {`
                    .chat-full-img {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }
                `}
            </style>
        </section>
    );
}
// END COMP

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

function urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
        var url2 = c == "www." ? "http://" + url : url;
        return (
            '<a href="' +
            url2 +
            '" target="_blank" rel="noopener noreferrer">' +
            url +
            "</a>"
        );
    });
}

function pickBubble({ from }) {
    const isBot = from === "Fidda Bot";
    if (isBot) return "other";

    const isCurrUserMsg = from === chatUserId;

    const currBubble = isCurrUserMsg ? "me" : "other";
    return currBubble;
}
// END HELPERS
