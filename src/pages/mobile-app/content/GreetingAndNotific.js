import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import getColor from "styles/txt";
import getDayGreetingBr from "utils/getDayGreetingBr";

const greeting = getDayGreetingBr();

export default function GreetingAndNotific({
    needAppForPreview,
    needAppForCliAdmin,
    totalNotifications,
    firstName,
    themeBackColor,
    colorP,
}) {
    return (
        <section className="mt-3 position-relative">
            <section className="position-relative">
                <div className="cliuser-app-ellipse" />
                <div className="cliuser-app-bell">
                    <AsyncBellNotifBtn
                        position="absolute"
                        forceCliUser
                        needClick={!(needAppForPreview || needAppForCliAdmin)}
                        top={21}
                        left={needAppForPreview ? 258 : 270}
                        notifBorderColor={`var(--themeBackground--${themeBackColor})`}
                        zIndex={2}
                        notifBackColor={
                            themeBackColor === "red"
                                ? "var(--themePLight--black)"
                                : "var(--expenseRed)"
                        }
                        badgeValue={totalNotifications}
                    />
                </div>
                <style jsx>
                    {`
                        .cliuser-app-ellipse {
                            background-color: ${colorP
                                ? `var(--themePLight--${colorP})`
                                : "#e84393"};
                            width: ${needAppForPreview && "21.8em"};
                        }
                    `}
                </style>
                <style jsx>
                    {`
                        .cliuser-app-ellipse {
                            position: relative;
                            top: -5px;
                            left: -50px;
                            height: 7em;
                            width: 23em;
                            z-index: 1;

                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: inset 0 0 0.7em #000;
                        }
                    `}
                </style>
            </section>
            <div
                style={{
                    position: "absolute",
                    top: "21px",
                    lineHeight: ".9em",
                    zIndex: 10,
                }}
                className={`ml-3 mb-2 ${
                    getColor(colorP).txtColor
                } text-subtitle text-left`}
            >
                {greeting},
                <br />
                <span className="text-title">{`${firstName}!`}</span>
            </div>
        </section>
    );
}
