import React, { Fragment } from 'react';
import Card from '@material-ui/core/Card';
import Title from '../../../../components/Title';
import useElemShowOnScroll from '../../../../hooks/scroll/useElemShowOnScroll';
import AutomaticOperations from './AutomaticOperations';

const getStyles = () => ({
    card: {
        width: '100%',
        minHeight: '400px',
        paddingTop: '5rem',
    },
    robot: {
        top: -40,
        left: '50%',
        transform: 'translateX(-50%)',
    }
});


export default function AutomaticSMS() {
    const opts = { detectionOnce: true }
    const triggered = useElemShowOnScroll(".automatic-sms-robot", opts);

    const styles = getStyles();

    return (
        <Fragment>
            <Title
                title="&#187; SMS automáticos"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <section className="container-center-max-width-500">
                <section className="position-relative">
                    <div className="position-absolute automatic-sms-robot" style={styles.robot}>
                        {triggered && (
                            <img
                                className="shadow-elevation-black animated fadeInUp slow delay-2s"
                                src="/img/icons/sms-fiddelize-robot.svg"
                                height="auto"
                                width={100}
                                alt="robô sms fiddelize"
                            />
                        )}
                    </div>
                    <Card
                        className={`pb-5 shadow-elevation`}
                        style={styles.card}
                        elevation={false}
                        raised={false}
                    >
                        <AutomaticOperations />
                    </Card>
                </section>
            </section>
        </Fragment>
    );
}