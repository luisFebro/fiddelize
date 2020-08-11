import React, { Fragment } from 'react';
import Operation from './Operation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getStyles = () => ({
    icon: {
        fontSize: '24px',
        color: 'var(--themeP)',
    },
});

const services = [
    {
        _id: 1,
        title: "Mensagem automática de saudade, quando cliente tiver 30 dias sem realizar uma compra.",
        isOn: true,
        disabled: false,
    },
    {
        _id: 2,
        title: "Aviso automático para o cliente quando você confirmar um desafio concluído",
        isOn: false,
        disabled: false,
    },
    {
        _id: 3,
        title: "Envio de SMS com link para o cliente baixar após primeira compra.",
        isOn: false,
        disabled: true,
    }
]

export default function AutomaticOperations() {
    const styles = getStyles();

    const showHeader = () => (
        <header className="d-flex justify-content-around">
            <div className="d-flex align-items-center">
                <FontAwesomeIcon
                    icon="cogs"
                    className="mr-2"
                    style={styles.icon}
                />
                <p className="text-purple text-subtitle font-weight-bold">
                    Serviço
                </p>
            </div>
            <p className="text-purple text-subtitle font-weight-bold">
                Ativado?
            </p>
        </header>
    );

    const MapServices = services.map(service => (
        <Fragment key={service._id}>
            <Operation
                title={service.title}
                isOn={service.isOn}
                disabled={service.disabled}
            />
        </Fragment>
    ));

    return (
        <section>
            {showHeader()}
            {MapServices}
        </section>
    );}