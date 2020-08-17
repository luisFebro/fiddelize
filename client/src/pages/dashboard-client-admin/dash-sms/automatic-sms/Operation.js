import React, { useState } from 'react';
import SwitchBtn from '../../../../components/buttons/material-ui/SwitchBtn'
import convertToReal from '../../../../utils/numbers/convertToReal';
import RadiusBtn from '../../../../components/buttons/RadiusBtn';
import useAPI, { activateAutoService, treatBoolStatus } from '../../../../hooks/api/useAPI';
import { useAppSystem } from '../../../../hooks/useRoleData';

export default function Operation({
    title,
    active = false,
    usage = 0,
    loading = false,
    dataSwitch,
    msg,
}) {
    const [trigger, setTrigger] = useState(false);
    const [data, setData] = useState({
        service: '',
        serviceId: '',
        innerActive: false,
    });

    const { businessId: userId } = useAppSystem();

    const { service, serviceId, innerActive } = data;

    usage = convertToReal(usage);

    const body = {
        userId,
        serviceId,
        service,
        active: innerActive,
    };

    const { loading: loadingSwitch } = useAPI({
        method: 'put',
        url: activateAutoService(),
        body,
        trigger,
        needAuth: true,
        snackbar: { txtSuccess: innerActive ? "SMS automático ativado!" : " " }
    })

    const plural = usage > 1 ? "s" : "";

    const handleSwitch = (status, data = {}) => {
        const { id, service } = data;
        const treatedStatus = treatBoolStatus(status);

        setTrigger(status);
        setData({
            ...data,
            serviceId: id,
            innerActive: treatedStatus,
            service,
        })
    }

    const showTitle = () => (
        <section className="container-center-col">
            <div
                className="ml-3 text-justify text-normal text-purple font-weight-bold"
            >
                {title}
            </div>
            <section>
                <RadiusBtn
                    title="Ver detalhes"
                    position="relative"
                    size="small"
                />
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