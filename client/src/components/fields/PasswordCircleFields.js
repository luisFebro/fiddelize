import React from "react";
import repeat from "../../utils/arrays/repeat";

const getStyles = () => ({
    passCircle: {
        width: "40px",
        height: "40px",
        background: "transparent",
        borderRadius: "50%",
        margin: "0 5px",
    },
    innerCircle: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
    },
});

function CircleField({ needDark = false, ind }) {
    const styles = getStyles();

    return (
        <div
            className="container-center"
            style={{
                ...styles.passCircle,
                border: needDark
                    ? "solid var(--mainDark) 4px"
                    : "solid var(--mainWhite) 4px",
            }}
        >
            <div
                className={`d-none pass-circle pass-block-${++ind}`}
                style={{
                    ...styles.innerCircle,
                    background: needDark ? "#000" : "#fff",
                }}
            ></div>
        </div>
    );
}

export default function PasswordCircleFields({
    needDark = false,
    fieldsN = 6, // default
}) {
    return (
        <section className="container-center shake-it">
            {repeat(fieldsN).map((x, ind) => (
                <CircleField key={ind} ind={ind} needDark={needDark} />
            ))}
        </section>
    );
}
