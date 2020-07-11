import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { fromNow } from '../../../../../utils/dates/dateFns';
import ActionBtn from './ActionBtn';

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

export default function TaskCard({ data = {} }) {
    const [moreInfo, setMoreInfo] = useState(false);

    const {
        done = false,
        taskType = "pendingDelivery",
        taskTitle = "Entrega de Prêmio",
        taskDesc = "Entregar para CLIENTNAME prêmio (PRIZENAME) do desafio de n.º CHALLNUM até REWARD",
        createdAt = new Date(),
    } = data;

    const styles = {
        card: {
            backgroundColor: !done ? 'var(--themePDark--default)' : 'grey',
            overflow: 'visible',
            padding: '5px 10px',
            marginBottom: '45px',
        },
    }

    const showTitle = () => (
        <div className="title text-white text-normal m-0">
            {taskTitle}
        </div>
    );

    const showCardDesc = taskDesc => {
        const showDate = () => (
            <div className="time-stamp text-small text-white font-weight-bold">
                {fromNow(createdAt)}
            </div>
        )

        const handleMoreInfo = () => {
            setMoreInfo(true);
        }

        return(
            <section className="desc text-left text-white font-weight-bold">
                <p className="brief mb-2 text-small">
                    {!moreInfo ? truncate(taskDesc, isSmall ? 40 : 75) : taskDesc}
                    {!moreInfo && (
                        <span
                            style={{textDecoration: 'underline'}}
                            onClick={handleMoreInfo}
                        > MOSTRAR MAIS</span>
                    )}
                </p>
                {showDate()}
            </section>
        );
    };

    return (
        <section className="position-relative" style={{marginBottom: '35px'}}>
            <Card
                className="mb-3"
                style={styles.card}
            >
                <section className="task-card--root position-relative">
                    {showTitle()}
                    <main className={`font-weight-bold text-normal text-center`}>
                        {showCardDesc(taskDesc)}
                    </main>
                </section>
            </Card>
            <ActionBtn type="pendingDelivery" />
        </section>
    );
}