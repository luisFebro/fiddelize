import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import ButtonMulti, {faStyle} from '../../components/buttons/material-ui/ButtonMulti';
import { useProfile } from '../../hooks/useRoleData';
// import parse from 'html-react-parser';
import { markOneClicked } from '../../redux/actions/notificationActions';
import { fromNow } from '../../utils/dates/dateFns';
import getFirstName from '../../utils/string/getFirstName';

NotifCard.propTypes = {
    cardType: PropTypes.oneOf([
        "system", // cliAdmin/cliUser
        "chatRequest", // future implementations...
        "welcome", // cliAdmin/cliUser
        "birthdaysInWeek", // cliAdmin
        "clientWonChall", // cliAdmin
        "newClientsToday", // cliAdmin
        "birthdayGreeting", // clieUser
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
    backColor = "default",
    isCardNew,
    createdAt,
    clicked,
}) {

    const { name, _id: userId } = useProfile();

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


    function getCardTypeData(cardType) {
        let title;
        let brief;
        let circularImg;

        switch(cardType) {
            case "welcome":
                title = `Boas vindas, ${getFirstName(name)}`;
                brief = "Conheça sobre como você vai ficar conectado com seus pontos de fidelidade";
                circularImg = "/img/icons/birthday-cake.svg";
                break;
            case "system":
                title = "TESTE card sistema";
                brief = "Test descrição";
                circularImg = "teste.svg";
                break;
            default:
                return null;
        }

        return {
            title,
            brief,
            circularImg,
        }
    }

    const { title, brief, circularImg } = getCardTypeData(cardType);

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

    const handleClickedCard = () => {
        markOneClicked(userId, cardId)
    }

    const showActionBtn = () => (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                title={!clicked ? "Ver" : `Ok ✔️`}
                textShadow={!clicked ? null : " "}
                color={!clicked ? "var(--mainWhite)" : "var(--mainDark)"}
                backgroundColor={!clicked ? "var(--themeSDark--" +  backColor + ")" : "var(--lightGrey)"}
            />
        </section>
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