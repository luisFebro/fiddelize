import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

Message.propTypes = {
    data: PropTypes.shape({
        sender: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        message: PropTypes.string,
    })
};
export default function Message({ data }) {
    // TODO: message needs to write a condition to not allow users to send empty messges
    const { sender, message, time } = data;
    return (
        <DivWrapper>
            <p className="text-normal text-capitalize">{sender}</p>
            <p style={{ wordWrap: 'breakWord' }} className="text-sub-container">
                {message}
            </p>
            <span>
                enviado em: <br />
                {time}
            </span>
        </DivWrapper>
    );
}

const DivWrapper = styled.div`
    & span {
        fontsize: 0.8em;
    }
    max-height: 120px;
    overflow: auto;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2), 0 10px 8px rgba(0, 0, 0, 0.12);
    border-radius: 15px;
    padding: 10px 5px;
    margin: 15px 5px;
    background-color: #f39c12;
    color: #ecf0f1;
`;
