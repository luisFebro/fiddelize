import React from 'react';
import PropTypes from 'prop-types';
import CreatedAtBr from '../../CreatedAtBr';

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function PanelHiddenContent({ data }) {
    const {
        service,
        notes,
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
            <div>
                <p>Serviço: {service}</p>
            </div>
            <div>
                <p>Observações: {
                    notes.length === 0
                    ? "Nenhuma"
                    : notes
                }</p>
            </div>
            <CreatedAtBr
                backgroundColor="7f8c8d"
                title="Criado pelo colaborador em:"
                createdAt={createdAt}
            />
        </div>
    );
}
