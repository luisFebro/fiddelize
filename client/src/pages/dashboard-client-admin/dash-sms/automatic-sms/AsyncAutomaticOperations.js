import React, { Fragment, useEffect, useState } from 'react';
import Operation from './Operation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  useAppSystem } from '../../../../hooks/useRoleData';
import useAPI, { readAutoService } from '../../../../hooks/api/useAPI';

const getStyles = () => ({
    icon: {
        fontSize: '24px',
        color: 'var(--themeP)',
    },
});

const serviceOptions = [
    {
        _id: 1,
        service: "missingPurchase",
        title: "Mensagem automática de saudade, quando cliente tiver 30 dias sem realizar uma compra.",
        usage: 0,
        msg: "",
    },
    {
        _id: 2,
        service: "confirmedChall",
        title: "Aviso automático para o cliente quando você confirmar um desafio concluído",
        usage: 0,
        msg: "",
    },
]

export default function AutomaticOperations() {
    const [services, setServices] = useState([]);
    const styles = getStyles();

    const { businessId: userId } = useAppSystem();

    const { data, loading } = useAPI({ url: readAutoService(userId), needAuth: true })

    useEffect(() => {
        if(data && !loading) {
            setServices([data, ...services])
            const serviceArray = [];
            data.forEach((db, ind) => {
                serviceOptions.forEach(option => {
                    if(option.service === db.service) {
                        const newOption = {
                            ...option,
                            _id: db._id,
                            active: db.active,
                            usage: db.usage,
                        }
                        serviceArray.push(newOption);
                    } else {
                        serviceArray.push(option);
                    }
                })
            });

            setServices([...serviceArray]);
        }

        if(!data && !loading) {
            setServices([...serviceOptions]);
        }
    }, [data, loading])

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

    return (
        <section>
            {showHeader()}
            {loading
            ? "Carregando serviços..."
            : (services && services.length) && services.map(service => (
                <Fragment key={service._id}>
                    <Operation
                        title={service.title}
                        usage={service.usage}
                        active={service.active}
                        loading={loading}
                    />
                </Fragment>
            ))}
        </section>
    );}