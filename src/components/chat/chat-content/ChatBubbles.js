import { Fragment } from "react";
import { fromNow } from "utils/dates/dateFns";

const msgListTest = [
    {
        _id: "1233ff2321",
        isFirstDayMsg: true,
        bubble: "me",
        msgs: [
            "Hey, I bought something yesterdat but haven't gotten any confirmation. Do you know I if the order went through?",
            "Hi! I just checked, cool, your order went through and is on it's way home. Enjoy your new computer! 😃",
        ],
        createdAt: new Date(),
    },
    {
        _id: "123323fsdfds21",
        isFirstDayMsg: false,
        bubble: "other",
        msgs: [
            "Ohh thanks ! I was really worried about it !",
            "Can't wait for it to be delivered",
        ],
        createdAt: new Date(),
    },
    {
        _id: "1233232fds1",
        isFirstDayMsg: true,
        bubble: "me",
        msgs: [
            "Aenean iaculis massa non lorem dignissim volutpat. Praesent id faucibus lorem, a sagittis nunc. Duis facilisis lectus vel sapien ultricies, sed placerat augue elementum. In sagittis, justo nec sodales posuere, nunc est sagittis tellus, eget scelerisque dolor risus vel augue",
            "Is everything alright?",
        ],
        createdAt: new Date(),
    },
    {
        _id: "12332321fdsf",
        isFirstDayMsg: false,
        bubble: "other",
        msgs: [
            "Vestibulum finibus pulvinar quam, at tempus lorem. Pellentesque justo sapien, pulvinar sed magna et, vulputate commodo nisl. Aenean pharetra ornare turpis. Pellentesque viverra blandit ullamcorper. Mauris tincidunt ac lacus vel convallis. Vestibulum id nunc nec urna accumsan dapibus quis ullamcorper massa. Aliquam erat volutpat. Nam mollis mi et arcu dapibus condimentum.",
            "Nulla facilisi. Duis laoreet dignissim lectus vel maximus",
            "Curabitur volutpat, ipsum a condimentum hendrerit ! 😊",
        ],
        createdAt: new Date(),
    },
    {
        _id: "12332321",
        isFirstDayMsg: true,
        bubble: "me",
        msgs: ["Obrigado, filho da puta!!!", "Bye!!!"],
        createdAt: new Date(),
    },
];

export default function ChatBubbles({ msgList = msgListTest }) {
    return (
        <Fragment>
            <div class="chat__content pt-4 px-3">
                <ul class="chat__list-messages">
                    {msgList.map((data) => (
                        <li key={data._id}>
                            {data.isFirstDayMsg && (
                                <div class="chat__time">
                                    {fromNow(data.createdAt)}
                                </div>
                            )}
                            {data.msgs.map((msg) => (
                                <div
                                    class={`chat__bubble chat__bubble--${data.bubble}`}
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
