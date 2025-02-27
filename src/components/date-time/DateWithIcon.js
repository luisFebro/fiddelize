import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { fromNow, calendar } from "utils/dates/dateFns";

DateWithIcon.propTypes = {
    marginTop: PropTypes.number,
};

// FOR TESTING DIFFERENT DATES
// let date = new Date();
// const daysBefore = 0;
// date.setDate(date.getDate() - daysBefore);
// END

// cssProps: background-color: ${({ cssProps }) => cssProps.btn || 'blue'};
export default function DateWithIcon({
    style,
    date,
    msgIfNotValidDate = "Sem atualização.",
    marginTop,
    needTxtShadow = false,
}) {
    return (
        <div>
            <section className="last-update" style={style}>
                <div className="icon">
                    <FontAwesomeIcon
                        icon="clock"
                        style={{
                            filter:
                                needTxtShadow &&
                                "drop-shadow(.5px .5px 1.5px black)",
                        }}
                    />
                </div>
                <p className={`text ${needTxtShadow && "text-shadow"}`}>
                    • Última atualização:
                    <br />
                    {date ? (
                        <span className="text-small font-weight-bold">
                            {calendar(date)}
                            <br />
                            {" - "}
                            {fromNow(date)}
                        </span>
                    ) : (
                        <span className="text-small font-weight-bold">
                            {msgIfNotValidDate}
                        </span>
                    )}
                </p>
            </section>
            <style jsx global>
                {`
                .last-update {
                    margin-top: ${`${marginTop}px;` || "70px;"}
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
            `}
            </style>
        </div>
    );
}
