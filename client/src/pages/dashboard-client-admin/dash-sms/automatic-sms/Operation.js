import React, { useState, useEffect } from 'react';
import SwitchBtn from '../../../../components/buttons/material-ui/SwitchBtn'
import convertToReal from '../../../../utils/numbers/convertToReal';
import DetailsBtn from './details-btn/DetailsBtn';
import useAPI, { activateAutoService, treatBoolStatus } from '../../../../hooks/api/useAPI';
import { useAppSystem } from '../../../../hooks/useRoleData';

export default function Operation({
    active = false,
    usage = 0,
    loading = false,
    dataSwitch,
    msg,
    title,
    subtitle,
}) {
    const [trigger, setTrigger] = useState(false);
    const [data, setData] = useState({
        service: '',
        serviceId: '',
        innerActive: false,
    });
    const { service, serviceId, innerActive } = data;

    const { businessId: userId } = useAppSystem();


    useEffect(() => {
        setData({ ...data, service: dataSwitch.service , serviceId: dataSwitch.serviceId  });
    }, [])

    usage = convertToReal(usage);

    const body = {
        userId,
        serviceId,
        service,
        active: innerActive,
        msg,
    };

    const { loading: loadingSwitch } = useAPI({
        method: 'put',
        url: activateAutoService(),
        body,
        trigger,
        needAuth: true,
        snackbar: { txtSuccess: innerActive ? `Pronto! Serviço ${title} ativado.` : "" }
    })

    const plural = usage > 1 ? "s" : "";

    const handleSwitch = (status, data = {}) => {
        const { serviceId, service } = data;
        const treatedStatus = treatBoolStatus(status);

        setTrigger(status);
        setData({
            service,
            serviceId,
            innerActive: treatedStatus,
        })
    }

    const modal = {
        msg,
        title,
        subtitle,
        body,
    }

    const showTitle = () => (
        <section className="container-center-col">
            <div
                className="ml-3 text-justify text-normal text-purple font-weight-bold"
            >
                {title}
            </div>
            <section>
                <DetailsBtn modal={modal} />
            </section>
        </section>
    );

    const showSwitchBtn = () => (
        <section className="mr-3">
            {!loading && (
                <SwitchBtn
                    callback={handleSwitch}
                    defaultStatus={active}
                    disabled={false}
                    loading={loadingSwitch}
                    data={dataSwitch}
                    pillStyle={true}
                />
            )}
            <div
                className={`text-normal text-center ${active ? "text-purple" : "text-grey"}`}
                style={{ lineHeight: '10px' }}
            >
                <span className="text-title">{loading ? "..." : usage} </span>
                SMS usado{plural}
            </div>
        </section>
    );

    return (
        <section className="d-flex mb-5">
            {showTitle()}
            {showSwitchBtn()}
        </section>
    );
}