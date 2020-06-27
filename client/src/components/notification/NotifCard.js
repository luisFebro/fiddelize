import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import ButtonMulti, {faStyle} from '../../components/buttons/material-ui/ButtonMulti';
import { useProfile, useClientAdmin } from '../../hooks/useRoleData';
import { markOneClicked } from '../../redux/actions/notificationActions';
import { fromNow } from '../../utils/dates/dateFns';
import getFirstName from '../../utils/string/getFirstName';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from 'easy-peasy';
import { setRun } from '../../hooks/useRunComp';
import uuidv1 from 'uuid/v1';

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
    backColor = "default",
    isCardNew,
    createdAt,
    msg,
    clicked,
}) {
    const dispatch = useStoreDispatch();
    const { name, _id: userId, role } = useProfile();
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

    const handledWelcomeBrief =
    role === "cliente"
    ? "Conheça sobre como você vai ficar conectado com seus pontos de fidelidade"
    : `${getFirstName(name)}, veja como a Fiddelize vai te deixar por dentro dos pontos de fidelidade dos seus clientes`

    const handledBirthdayGreeting =
    role === "cliente"
    ? `${getFirstName(name)}, muitas felicidades e sucessos são os votos de ${bizName} neste dia tão especial para você!`
    : `Pensou que você não receberia uma notificação de aniversário também? Surpresa, ${getFirstName(name)}! A Fiddelize te deseja ainda mais clientes para seu negócio recheada de sucesso para sua vida!`

    // test
    //This will send through the message like:
    //firstName_3
    const clientName = "Anna da Silva Ribeiro"; // get the entire name,display brief onlyfirst name, page entire.
    const currChall = "3";
    function getCardTypeData(cardType) {
        let title;
        let brief;
        let circularImg;

        switch(cardType) {
            case "welcome":
                title = `Boas vindas, ${getFirstName(name)}`;
                brief = handledWelcomeBrief;
                circularImg = "/img/icons/calendar-welcome.svg";
                break;
            case "clientWonChall":
                title = `Cliente concluíu desafio`;
                brief = `${getFirstName(clientName)} concluíu desafio de n.° ${currChall}. Confirme esse desafio do cliente descontando os pontos.`
                circularImg = "/img/icons/fiddelize-trophy.svg";
                break;
            case "birthdayGreeting":
                title = `Feliz Aniversário!`;
                brief = handledBirthdayGreeting;
                circularImg = "/img/icons/birthday-cake.svg";
                break;
            case "birthdaysInWeek":
                title = `Aniversários da semana`;
                brief = "Lista de clientes aniversariantes da semana 21/07 por ordem de pontos acumulados";
                circularImg = "/img/icons/birthday-customers.svg";
                break;
            case "system":
                title = "Fiddelize informa:";
                brief = "this should be changed dynamically with a subType variable from backend";
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
        .then(res => {
            if(res.status !== 200) return console.log("smt worng with handleClickedCard")
            setRun(dispatch, `notificationCount${uuidv1()}`)
        })
    }

    const showActionBtn = () => (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                title={!clicked ? "Ver" : `Ok ✔️`}
                iconFontAwesome={!clicked ? <FontAwesomeIcon icon="bolt" style={{...faStyle, fontSize: 22}} /> : null}
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