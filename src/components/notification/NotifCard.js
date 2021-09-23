import React from "react";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import useSexLetter from "hooks/biz/useSexLetter";
import useData, { useBizData } from "init";
import useDelay from "hooks/useDelay";
import { fromNow } from "utils/dates/dateFns";
import NewCardPill from "components/pills/NewCardPill";
import getCardTypeData from "./helpers/getCardTypeData";
import CardActionBtn from "./card-type-pages/CardActionBtn";

NotifCard.propTypes = {
    cardType: PropTypes.oneOf([
        "system", // cliAdmin/cliUser for succeful purchase, warnings of deadlines, warnign of usage os SMS, promotions
        "chatRequest", // future implementations...
        "welcome", // cliAdmin/cliUser (active)
        "challenge", // cliAdmin (active)
        "birthday", // clieUser (active) / cliAdmin
        "pro", // cliAdmin (active)
        "score",
    ]),
    isCardNew: PropTypes.bool,
    createdAt: PropTypes.string,
    clicked: PropTypes.bool,
};

const getStyles = ({ clicked, backColor, grayScaleReady }) => ({
    card: {
        backgroundColor: !clicked ? `var(--themePDark--${backColor})` : "grey",
        overflow: "visible",
    },
    circularImg: {
        filter: clicked && grayScaleReady ? "grayscale(100%)" : "grayscale(0%)",
        transition: "filter 7s",
    },
});

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

function NotifCard(props) {
    const {
        forceCliUser,
        updatedBy,
        clicked,
        backColor,
        content,
        subtype,
        cardType,
        createdAt,
        isCardNew,
    } = props;

    const [ultimateRole, ultimateName, ultimateUserId] = useData([
        "role",
        "firstName",
        "userId",
    ]);
    let { name: userName, userId } = useData();
    userName = ultimateName !== "..." ? ultimateName : userName;
    userId = ultimateUserId !== "..." ? ultimateUserId : userId;

    const genderLetter = useSexLetter();

    let { role } = useData();
    role = ultimateRole !== "..." ? ultimateRole : role;
    if (forceCliUser) role = "cliente";

    const { bizName } = useBizData();

    const grayScaleReady = useDelay(3000);

    const styles = getStyles({ clicked, backColor, grayScaleReady });

    const isCliMember = updatedBy && updatedBy.role === "cliente-membro";

    const showDate = () => (
        <div className="time-stamp text-small text-white font-weight-bold">
            {fromNow(createdAt)}
        </div>
    );

    const opts = { genderLetter, userName, bizName, role, content, subtype };
    const { title, brief, circularImg } = getCardTypeData(cardType, opts);

    const showTitle = () => (
        <div className="title text-white text-normal m-0">{title}</div>
    );

    const cardBrief = brief && brief.replace(/§/gi, "");
    const showCardDesc = () => (
        <section className="desc text-left text-white font-weight-bold">
            <p className="brief my-2 text-small">
                {truncate(cardBrief, isSmall ? 52 : 75)}
            </p>
            {showDate()}
        </section>
    );

    const ctaProps = {
        ...props,
        userName,
        userId,
        role,
        brief,
        circularImg,
        bizName,
    };

    const showActionBtn = () => <CardActionBtn {...ctaProps} />;

    const showNewCardBadge = () => !isCliMember && isCardNew && <NewCardPill />;

    const showCircularImg = () => (
        <div
            className="circular-img animated fadeInUp delay-1s"
            style={styles.circularImg}
        >
            <img
                className="shadow-elevation-black"
                src={circularImg}
                alt="visual card"
                width={40}
                height={40}
            />
        </div>
    );

    return (
        <Card className="mb-3" style={styles.card}>
            <section className="notif-card--root position-relative">
                {showTitle()}
                <main className="font-weight-bold text-normal text-center">
                    {showCardDesc()}
                    {showActionBtn()}
                </main>
                <section className="visual-assets position-absolute">
                    <div className="d-flex">
                        {showCircularImg()}
                        <div>{showNewCardBadge()}</div>
                    </div>
                </section>
            </section>
        </Card>
    );
}

export default React.memo(NotifCard);
