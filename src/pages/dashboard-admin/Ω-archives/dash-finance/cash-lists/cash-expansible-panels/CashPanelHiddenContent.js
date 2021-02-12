import React from 'react';
import PropTypes from 'prop-types';
import CreatedAtBr from '../../../CreatedAtBr';
import capitalize from '../../../../../utils/string/capitalize';

CashHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function CashHiddenContent({ data, isCashOut = false }) {
    const {
        service,
        description,
        paymentType,
        agentRole,
        clientName,
        installmentsIfCredit,
        createdAt,
    } = data;

    const styles = {
        pointsContainer: {
            position: 'relative'
        }
    }

    return (
        <div
            className="text-normal enabledLink"
            style={{userSelect: 'text', margin: 'auto', width: '90%'}}
        >
            {!isCashOut
            ? (
                <p>
                    <span className="font-weight-bold">&#187; Serviço:</span>
                    <br />
                    {service}
                </p>
            ) : null}

            {!isCashOut && agentRole === "colaborador"
            ? (
                <p>
                    <span className="font-weight-bold">&#187; Cliente:</span>
                    <br />
                    {clientName && clientName.cap()}
                </p>
            ) : null}

            <p className="text-break">
                <span className="font-weight-bold">&#187; Descrição:</span>
                <br />
                {capitalize(description)}
            </p>

            <p>
                <span className="font-weight-bold">&#187; Meio de Pagamento:</span>
                <br />
                {paymentType}{paymentType === 'crédito' ? ` em ${installmentsIfCredit} vezes.` : ""}
            </p>

            <CreatedAtBr
                backgroundColor="7f8c8d"
                title="Operação criada em:"
                createdAt={createdAt}
            />
        </div>
    );
}
