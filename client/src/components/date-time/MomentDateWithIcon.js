import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
moment.updateLocale('pt-BR');

// FOR TESTING DIFFERENT DATES
// let date = new Date();
// const daysBefore = 0;
// date.setDate(date.getDate() - daysBefore);
// END

const Div = styled.div`
    .last-update {
        margin-top: 70px;
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        align-items: center;
    }

    .last-update .icon {
        margin-right: 15px;
        font-size: 30px;
    }

    .last-update .text {
        white-space: nowrap;
        line-height: 20px;
        margin-bottom: 0;
    }
`;

// cssProps: background-color: ${({ cssProps }) => cssProps.btn || 'blue'};
export default function MomentDateWithIcon({ style, date, msgIfNotValidDate = "Sem atualização." }) {
    return (
        <Div cssProps={{compName: null}}>
            <section className="last-update" style={style}>
                <div className="icon">
                    <FontAwesomeIcon icon="clock" />
                </div>
                <p className="text">
                    • Última atualização:
                    <br />
                    {date
                    ? (
                        <span className="text-small font-weight-bold">
                            {moment(date).calendar(null, { sameElse: 'll'})}{" - "}
                            {moment(date).fromNow()}
                        </span>
                    ) : (
                        <span className="text-small font-weight-bold">
                            {msgIfNotValidDate}
                        </span>
                    )}
                </p>
            </section>
        </Div>
    );
}