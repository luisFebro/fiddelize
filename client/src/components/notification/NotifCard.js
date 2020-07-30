import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { useProfile, useClientAdmin } from '../../hooks/useRoleData';
import useDelay from '../../hooks/useDelay';
import { fromNow } from '../../utils/dates/dateFns';
import getCardTypeData from './helpers/getCardTypeData';
import CardActionBtn from './card-type-pages/CardActionBtn';

NotifCard.propTypes = {
    cardType: PropTypes.oneOf([
        "system", // cliAdmin/cliUser for succeful purchase, warnings of deadlines, warnign of usage os SMS, promotions
        "chatRequest", // future implementations...
        "welcome", // cliAdmin/cliUser (active)
        "challenge", // cliAdmin (active)
        "birthday", // clieUser (active)
    ]),
    isCardNew: PropTypes.bool,
    createdAt: PropTypes.string,
    clicked: PropTypes.bool,
}

const getStyles = ({ clicked, backColor, grayScaleReady }) => ({
    card: {
        backgroundColor: !clicked ? 'var(--themePDark--' + backColor + ')' : 'grey',
        overflow: 'visible',
    },
    newBadge: {
        borderRadius: '40%',
        padding: '0px 4px',
        border: '3px solid var(--mainWhite)',
        background: "var(--niceUiYellow)",
        color: 'var(--mainDark)',
        animationDuration: '3s',
    },
    circularImg: {
        filter: clicked && grayScaleReady ? "grayscale(100%)" : "grayscale(0%)",
        transition: "filter 7s",
    }
});

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

function NotifCard({
    cardId,
    senderId,
    cardType = "system",
    subtype,
    backColor = "default",
    isCardNew,
    createdAt,
    content,
    clicked,
    forceCliUser = false,
}) {
    const { name: userName, _id: userId } = useProfile();
    let { role } = useProfile();
    if(forceCliUser) role = "cliente";

    const { bizName } = useClientAdmin();

    const grayScaleReady = useDelay(3000);

    const styles = getStyles({ clicked, backColor, grayScaleReady });

    const showDate = () => (
        <div className="time-stamp text-small text-white font-weight-bold">
            {fromNow(createdAt)}
        </div>
    )

    const opts = { userName, bizName, role, content, subtype };
    const { title, brief, circularImg } = getCardTypeData(cardType, opts);

    const showTitle = () => (
        <div className="title text-white text-normal m-0">
            {title}
        </div>
    );

    const cardBrief = brief.replace(/§/gi, "");
    const showCardDesc = cardType => {
        return(
            <section className="desc text-left text-white font-weight-bold">
                <p className="brief mb-2 text-small">
                    {truncate(cardBrief, isSmall ? 52 : 75)}
                </p>
                {showDate()}
            </section>
        );
    };

    const showActionBtn = () => (
        <CardActionBtn
            userId={userId}
            senderId={senderId}
            cardId={cardId}
            cardType={cardType}
            clicked={clicked}
            backColor={backColor}
            content={content}
            subtype={subtype}
            brief={brief}
            circularImg={circularImg}
            role={role}
            forceCliUser={forceCliUser}
        />
    );

    const showNewCardBadge = () => (
        isCardNew &&
        <div
            style={styles.newBadge}
            className="font-weight-bold animated fadeInUp delay-3s delay-3s text-small text-center"
        >
            Novo
        </div>
    );

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
        <Card
            className="mb-3"
            style={styles.card}
        >
            <section className="notif-card--root position-relative">
                {showTitle()}
                <main className={`font-weight-bold text-normal text-center`}>
                    {showCardDesc()}
                    {showActionBtn()}
                </main>
                <section className="visual-assets position-absolute">
                    <div className="d-flex">
                        {showCircularImg()}
                        <div>
                            {showNewCardBadge()}
                        </div>
                    </div>
                </section>
            </section>
        </Card>
    );
}

export default React.memo(NotifCard);

NotifCard.whyDidYouRender = false;