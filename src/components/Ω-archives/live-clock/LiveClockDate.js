import { useState, useEffect } from "react";
import { default as DigitalClock } from "react-live-clock";
import Tilt from "react-tilt";
import Clock from "react-clock";
import parse from "html-react-parser";
import { transitionLeftToRight } from "./transitionLeftToRightScreen";
import "./Clock.css";
import getDayMonthBr from "../../utils/dates/getDayMonthBr";
import getWeekDayBr from "../../utils/dates/getWeekDayBr";
import { CLIENT_URL } from "../../config/clientUrl";

const isSmall = window.Helper.isSmallScreen();

export default function LiveClockDate() {
    const [date, setDate] = useState(new Date());
    const styles = {
        root: {
            position: "relative",
        },
        digitalClock: {
            color: "var(--mainPink)",
            fontSize: "7.5em",
            filter: "drop-shadow(.001em .001em .01em var(--mainDark))",
        },
        date: {
            color: "var(--mainPink)",
            fontSize: "3.0em",
            filter: "drop-shadow(.001em .001em .01em var(--mainDark))",
        },
        now: {
            color: "var(--mainPink)",
            fontSize: "5em",
            filter: "drop-shadow(.001em .001em .01em var(--mainDark))",
            fontFamily: "cursive",
            zIndex: 1000,
        },
        analogicClock: {
            height: 250,
            width: 250,
            zIndex: 1000,
        },
    };

    useEffect(() => {
        const secInterval = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(secInterval);
    }, []);

    return (
        <div style={styles.root} className="container-center py-4">
            <Tilt
                className="Tilt"
                options={{ max: 50, reverse: true }}
                style={styles.analogicClock}
            >
                <div
                    style={styles.analogicClock}
                    className="Tilt-inner animated slideInLeft slow delay-4 mr-md-5"
                >
                    <Clock
                        className="react-clock shadow-elevation"
                        hourHandLength={60}
                        hourHandOppositeLength={20}
                        hourHandWidth={8}
                        hourMarksLength={20}
                        hourMarksWidth={8}
                        minuteHandLength={90}
                        minuteHandOppositeLength={20}
                        minuteHandWidth={6}
                        minuteMarksWidth={3}
                        secondHandLength={80}
                        secondHandOppositeLength={25}
                        secondHandWidth={7}
                        size={250}
                        value={date}
                    />
                </div>
            </Tilt>
            <div className="container-center display-flex flex-column">
                <div
                    className="animated zoomIn delay-2 slow"
                    style={styles.now}
                >
                    AGORA
                </div>
                <div className="animated zoomIn delay-2 slow">
                    <DigitalClock
                        style={styles.digitalClock}
                        format="HH:mm"
                        ticking
                    />
                </div>
                <div
                    className="text-center animated slideInRight delay-2 slow"
                    style={styles.date}
                >
                    {parse(
                        `${getWeekDayBr()} ${
                            isSmall ? "<br />" : "-"
                        } ${getDayMonthBr(date)}`
                    )}
                </div>
            </div>
            <DivWrapper>
                <img
                    className="cloud1"
                    src={`${CLIENT_URL}/img/icons/cloud.svg`}
                    alt="nuvem"
                    width={100}
                    height={100}
                />
                <img
                    className="cloud2"
                    src={`${CLIENT_URL}/img/icons/cloud.svg`}
                    alt="nuvem"
                    width={90}
                    height={90}
                />
                <img
                    className="cloud3"
                    src={`${CLIENT_URL}/img/icons/cloud.svg`}
                    alt="nuvem"
                    width={110}
                    height={110}
                />
                <img
                    className="cloud4"
                    src={`${CLIENT_URL}/img/icons/cloud.svg`}
                    alt="nuvem"
                    width={100}
                    height={100}
                />
            </DivWrapper>
        </div>
    );
}

const DivWrapper = styled.div`
    .cloud1 {
        position: absolute;
        top: 10px;
        left: 150px;
        animation: ${transitionLeftToRight} 35s linear infinite;
    }
    ,
    .cloud2 {
        position: absolute;
        top: -40px;
        left: 400px;
        animation: ${transitionLeftToRight} 33s linear infinite;
    }
    ,
    .cloud3 {
        position: absolute;
        top: -50px;
        left: 300px;
        animation: ${transitionLeftToRight} 50s linear infinite;
    }
    ,
    .cloud4 {
        position: absolute;
        top: 60px;
        left: 150px;
        animation: ${transitionLeftToRight} 40s linear infinite;
    }
`;
