import React, { useState, forwardRef } from 'react';
import Card from '@material-ui/core/Card';
import { fromNow, formatDMY } from '../../../../../utils/dates/dateFns';
import useAPI, { toggleDoneUrl, changePrizeStatus, treatBoolStatus } from '../../../../../hooks/api/useAPI';
import ActionBtn from './ActionBtn';
import { useProfile } from '../../../../../hooks/useRoleData';
import extractStrData from '../../../../../utils/string/extractStrData';

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();
/*
if done,
Feito por: Febro.
Atividade Feita:
 */

function TaskCard(props, ref) {
    const { data = {}, defaultStatus = false, className, } = props;
    const [moreInfo, setMoreInfo] = useState(false);
    const [toggleDone, setToggleDone] = useState(undefined);

    const {
        _id: taskId,
        done = false,
        taskType = "pendingDelivery",
        taskTitle = "Entrega de Prêmio",
        content = "userName:Ana Rodrigues;prizeDesc:tickets 1;challNum:5;deadline:14/07/20;",
        madeBy = "Febro",
        madeDate = "11/08/20 às 10:50",
        createdAt = new Date(),
    } = data;

    const {
        cliUserId,
        cliUserName,
        prizeDesc,
        challNum,
        deadline,
        prizeId,
    } = extractStrData(content);

    const { _id: userId } = useProfile();
    const taskBody = { userId, taskId, doneStatus: treatBoolStatus(toggleDone) }
    const snackbar = { txtSuccess: treatBoolStatus(toggleDone) ? `Status alterado para FEITO! Movendo para tarefas feitas...` : `Tarefa movida para o PAINEL PRINCIPAL!`}
    const purchaseSnackbar = { txtSuccess: `Status RECEBIDO marcado no histórico de compra do cliente.`, txtFailure: ""}
    const trigger = toggleDone === undefined ? false : toggleDone;
    useAPI({ method: "put", url: toggleDoneUrl(), body: taskBody, snackbar, trigger, runName: `TaskCard${taskId}` })
    const prizeParams = { newValue: treatBoolStatus(toggleDone), prizeId };
    useAPI({ method: "put", url: changePrizeStatus(cliUserId, "received"), params: prizeParams, trigger, snackbar: purchaseSnackbar })

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

    const handleMoreInfo = () => {
        setMoreInfo(true);
    }

    const showCardDesc = () => {
        let taskDesc = `• Entregar para ${cliUserName.toUpperCase()} o prêmio (${prizeDesc}) do desafio de n.º ${challNum} até ${formatDMY(deadline)}`;
        if(done) taskDesc = `Foi entregue para cliente ${cliUserName.toUpperCase()} - no dia ${formatDMY(madeDate)} - o prêmio: ${prizeDesc}.`;
        return(
            <p className="brief mb-2 text-small">
                {done && <span className="font-weight-bold">• TAREFA: </span>}
                {!moreInfo ? truncate(taskDesc, isSmall ? 40 : 75) : taskDesc}
                {!moreInfo && (
                    <span
                        style={{textDecoration: 'underline'}}
                        onClick={handleMoreInfo}
                    > MOSTRAR MAIS</span>
                )}
            </p>
        );
    };

    const showDate = () => (
        <div className="time-stamp text-small text-white font-weight-bold">
            {done ? `gerado ${fromNow(createdAt)}` : fromNow(createdAt)}
        </div>
    );

    const handleToggleBtnRes = toggleRes => {
        setToggleDone(toggleRes);
    }

    return (
        <section
            className={`${className ? `${className} position-relative`: "position-relative"}`} style={{marginBottom: '35px'}}
            ref={ref}
        >
            <Card
                className="mb-3"
                style={styles.card}
            >
                <section className="task-card--root position-relative">
                    {showTitle()}
                    <main className="desc text-left text-small text-white">
                        {showCardDesc()}
                        {done && moreInfo && <p className="text-white"><span className="font-weight-bold">• FEITO POR: </span> {madeBy}</p>}
                        {showDate()}
                    </main>
                </section>
            </Card>
            <ActionBtn
                type="pendingDelivery"
                callback={handleToggleBtnRes}
                defaultStatus={defaultStatus}
            />
        </section>
    );
}


export default forwardRef(TaskCard);