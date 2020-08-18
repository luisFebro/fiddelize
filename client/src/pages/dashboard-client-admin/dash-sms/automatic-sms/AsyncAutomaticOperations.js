import React, { Fragment, useEffect, useState } from 'react';
import Operation from './Operation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  useAppSystem, useClientAdmin } from '../../../../hooks/useRoleData';
import useAPI, { readAutoService } from '../../../../hooks/api/useAPI';

const getStyles = () => ({
    icon: {
        fontSize: '24px',
        color: 'var(--themeP)',
    },
});

const serviceOptions = ({ bizName }) => ([
    {
        _id: 1,
        service: "missingPurchase",
        title: "Mensagem de Saudade",
        subtitle: "Mensagem automática de saudade, quando cliente tiver 30 dias sem realizar uma compra.",
        usage: 0,
        msg: `Sentimos sua falta. A ${bizName.toUpperCase()} não esqueceu de você e está sempre de portas abertas.`,
    },
    {
        _id: 2,
        service: "confirmedChall",
        title: "Confimação de desafio",
        subtitle: "Aviso automático para o cliente quando você confirmar/descontar um desafio concluído",
        usage: 0,
        msg: `Opa! Seu desafio foi confirmado pela ${bizName.toUpperCase()}. Abra app aqui: https://fiddelize.com.br/mobile-app?is_app=1`,
    },
]);

export default function AutomaticOperations() {
    const [services, setServices] = useState([]);
    const [already, setAlready] = useState(false);
    const styles = getStyles();

    const { businessId: userId } = useAppSystem();
    const { bizName } = useClientAdmin();

    const { data, loading } = useAPI({ url: readAutoService(userId), needAuth: true })

    useEffect(() => {
        if(data && !loading && !already) {
            const serviceArray = [];
            data.forEach((db, ind) => {
                serviceOptions({ bizName }).forEach(option => {
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
            setAlready(true);
            setServices([...serviceArray]);
        }

        if(data && !data.length && !loading) {
            setServices([...serviceOptions({ bizName })]);
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
            ? (
                <p className="my-5 text-center text-purple text-subtitle font-weight-bold">
                    Carregando serviços...
                </p>
            ) : (Boolean(services && services.length)) && services.map(service => (
                <Fragment key={service._id}>
                    <Operation
                        dataSwitch={{ id: service._id, service: service.service }}
                        usage={service.usage}
                        msg={service.msg}
                        title={service.title}
                        subtitle={service.subtitle}
                        active={service.active}
                        loading={loading}
                    />
                </Fragment>
            ))}
        </section>
    );}