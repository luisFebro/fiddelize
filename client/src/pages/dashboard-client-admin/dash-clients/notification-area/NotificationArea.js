import React from 'react';
import Title from '../../../../components/Title';

export default function NotificationArea({ userName, notifElemsArray }) {
    notifElemsArray = []; // {first: 'year'}

    const styles = {
        badge: {
            border: `2px solid var(--mainDark)`,
            padding: '6px 14px',
            fontSize: '32px',
            fontWeight: 'bold',
            backgroundColor: 'var(--themeSDark)',
            color: 'white',
            borderRadius: '50%',
        }
    }

    return (
        <div className="text-normal container-center flex-column" style={{color: 'grey'}}>
            <Title
                title="&#187; Novidades do dia"
                color="var(--themeP)"
                margin="mt-4 mb-1"
                padding=" "
            />
            {notifElemsArray.length !== 0
            ? (
                <div className="font-weight-bold">
                    {userName && userName.cap()},
                    <br />
                    Você tem <span style={styles.badge}>{notifElemsArray ? notifElemsArray.length : 0}</span> novidades
                    por aqui:
                </div>

            ) : (
                <p>
                    <strong>
                        {userName && userName.cap()},
                        <br />nenhuma por enquanto.
                    </strong>
                    <br />Aqui você se atualiza fácil e ver:
                    <br />• clientes cadastrados do dia;
                    <br />• clientes aniversariantes do dia;
                    <br />• clientes que atingiram sua meta de pontos.
                </p>
            )}
        </div>
    );
}