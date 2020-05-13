import React from 'react';
import Card from '@material-ui/core/Card';
import ButtonMulti, {faStyle} from '../../../../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

OptionCard.propTypes = {
    title: PropTypes.string,
    mainContent: PropTypes.node,
}

export default function OptionCard({
    title,
    mainContent,
    onBtnClick,
}) {

    return (
        <Card
            className="align-self-center animated shadow-elevation p-4 mt-5 mt-md-0 mr-md-5"
            style={{
                width: 200,
                height: 250,
                backgroundColor: 'var(--mainWhite)',
                boxShadow: '0 31px 120px -6px rgba(0, 0, 0, 0.35)',
            }}
        >
            <p className="text-center text-subtitle font-weight-bold text-purple">
                {parse(title)}
            </p>
            <section style={{ minHeight: 100 }}>
                {mainContent}
            </section>
            <div className="container-center">
                <ButtonMulti
                    onClick={onBtnClick}
                    title="Trocar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform='uppercase'
                    iconFontAwesome={<FontAwesomeIcon icon="exchange-alt" style={faStyle} />}
                />
            </div>
        </Card>
    );
}