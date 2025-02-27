import { Fragment, useState } from "react";
import Card from "@material-ui/core/Card";
import Title from "../../../../components/Title";
import { Load } from "../../../../components/code-splitting/LoadableComp";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";

const AsyncAutomaticOps = Load({
    loader: () =>
        import(
            "./AsyncAutomaticOperations" /* webpackChunkName: "automatic-ops-comp-lazy" */
        ),
});

const getStyles = () => ({
    card: {
        width: "100%",
        minHeight: "400px",
        paddingTop: "5rem",
    },
});

export default function AutomaticSMS() {
    const [open, setOpen] = useState(false);
    // const opts = { detectionOnce: true } // This works well but do not need it anymore
    // const triggered = useElemShowOnScroll(".automatic-sms-robot", opts);

    const styles = getStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const showCTA = () =>
        !open && (
            <section className="my-5 container-center">
                <ButtonFab
                    size="large"
                    title="Ver serviços"
                    position="relative"
                    onClick={handleOpen}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                />
            </section>
        );

    return (
        <Fragment>
            <Title
                title="&#187; SMS automáticos"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            {showCTA()}
            {open && (
                <section className="animated fadeInUp container-center-max-width-500">
                    <section className="position-relative">
                        <div className="position-absolute animated fadeInUp">
                            <img
                                className="automatic-fiddelize-robot shadow-elevation-black animated fadeInUp slow delay-1s"
                                src="/img/icons/sms-fiddelize-robot.svg"
                                height="auto"
                                width={100}
                                alt="robô sms fiddelize"
                            />
                            <style jsx>
                                {`
                                    .automatic-fiddelize-robot {
                                        top: -40px;
                                        left: 50%;
                                        transform: translateX(-50%);
                                    }
                                `}
                            </style>
                        </div>
                        <Card
                            className="pb-5 shadow-elevation"
                            style={styles.card}
                            elevation={false}
                            raised={false}
                        >
                            <AsyncAutomaticOps />
                        </Card>
                    </section>
                </section>
            )}
        </Fragment>
    );
}
