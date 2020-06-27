import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { useProfile, useClientAdmin } from '../../hooks/useRoleData';
import { fromNow } from '../../utils/dates/dateFns';
import getCardTypeData from './helpers/getCardTypeData';
import CardActionBtn from './card-type-pages/CardActionBtn';

NotifCard.propTypes = {
    cardType: PropTypes.oneOf([
        "system", // cliAdmin/cliUser for succeful purchase, warnings of deadlines, warnign of usage os SMS, promotions
        "chatRequest", // future implementations...
        "welcome", // cliAdmin/cliUser (active)
        "birthdaysInWeek", // cliAdmin (active)
        "clientWonChall", // cliAdmin (active)
        "birthdayGreeting", // clieUser (active)
    ]),
    isCardNew: PropTypes.bool,
    createdAt: PropTypes.string,
    clicked: PropTypes.bool,
}

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

function NotifCard({
    cardId,
    cardType = "system",
    subType,
    backColor = "default",
    isCardNew,
    createdAt,
    content,
    clicked,
}) {
    const { name: userName, _id: userId, role } = useProfile();
    const { bizName } = useClientAdmin();

    const styles = {
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
        }
    }

    const showDate = () => (
        <div className="time-stamp text-small text-white font-weight-bold">
            {fromNow(createdAt)}
        </div>
    )

    const opts = { userName, bizName, role, content, subType };
    const { title, brief, circularImg } = getCardTypeData(cardType, opts);

    const showTitle = () => (
        <div className="title text-white text-normal m-0">
            {title}
        </div>
    );
    const showCardDesc = cardType => {
        return(
            <section className="desc text-left text-white font-weight-bold">
                <p className="brief mb-2 text-small">
                    {truncate(brief, isSmall ? 50 : 75)}
                </p>
                {showDate()}
            </section>
        );
    };

    const showActionBtn = () => (
        <CardActionBtn
            userId={userId}
            cardId={cardId}
            cardType={cardType}
            clicked={clicked}
            backColor={backColor}
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

NotifCard.whyDidYouRender = true;