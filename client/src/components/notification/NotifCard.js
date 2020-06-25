import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import ButtonMulti, {faStyle} from '../../components/buttons/material-ui/ButtonMulti';
import { useProfile } from '../../hooks/useRoleData';
import parse from 'html-react-parser';
import { markOneClicked } from '../../redux/actions/notificationActions';

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

const styles = {
    newBadge: {
        top: 0,
        right: 0,
        radiusBorder: '50%',
        padding: '4px 7px',
        background: "var(--mainWhite)",
        color: "black",
    }
}

function NotifCard({
    cardId,
    cardType = "system",
    backColor = "default",
    isCardNew,
    createdAt,
    clicked,
}) {

    const { name, _id: userId } = useProfile();

    const showCardDesc = cardType => {
        let msg;
        switch(cardType) {
            case "welcome":
                msg = parse(`Boas vindas, <br />${name}`); break;
            case "system":
                msg = "TESTE card sistema"; break;
            default:
                return null;
        }
        return(
            <section className="desc text-normal text-white">
                {msg}
            </section>
        );
    };

    const handleClickedCard = () => {
        markOneClicked(userId, cardId)
        .then(res => {
            alert("clicked set: " + res.data.msg)
        })
    }

    const showActionBtn = () => (
        <section>
            <ButtonMulti
                onClick={handleClickedCard}
                title={!clicked ? "Ver" : "Visto"}
                shadowColor={!clicked ? "black" : " "}
                color={!clicked ? "var(--mainWhite)" : "var(--mainDark)"}
                backgroundColor={!clicked ? "var(--themeSDark--" +  backColor + ")" : "var(--lightGrey)"}
            />
        </section>
    );

    const showDate = () => (
        <div className="text-small text-white">
            {createdAt}
        </div>
    )

    const showNewCardBadge = () => (
        isCardNew &&
        <div style={styles.newBadge}>
            Novo
        </div>
    );

    return (
        <Card
            className="mt-2"
            style={{backgroundColor: !clicked ? 'var(--themePDark--' + backColor + ')' : 'grey'}}
        >
            <section className="notif-card--root position-relative">
                <main className={`text-white font-weight-bold text-normal text-center text-purple`}>
                    {showCardDesc(cardType)}
                    {showActionBtn()}
                    {showDate()}
                </main>
                <div className="position-absolute">
                    {showNewCardBadge()}
                </div>
            </section>
        </Card>
    );
}

export default React.memo(NotifCard);

NotifCard.whyDidYouRender = true;