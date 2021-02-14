export const getStyles = ({ colorP, colorS, colorBack, dynamicTxtColor }) => ({
    finishButton: {
        border: "none",
        fontWeight: "bold",
        fontSize: "1.5em",
        padding: "25px 35px",
        borderRadius: "20px",
        backgroundColor: `var(--themeSDark--${colorS})`,
        color: "var(--mainWhite)",
        outline: "none",
        filter: `drop-shadow(.001em .15em .2em ${
            colorBack === "black" ? "var(--mainWhite)" : "var(--mainDark)"
        })`,
    },
    crownIcon: {
        position: "absolute",
        filter: "drop-shadow(.001em .001em .75em var(--mainDark))",
        top: "-45px",
        left: "218px",
        fontSize: "2em",
        transform: "rotate(20deg)",
        color: dynamicTxtColor,
    },
    challN: {
        backgroundColor: `var(--themePDark--${colorP})`,
        borderRadius: "50%",
        padding: "8px",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "-30px",
    },
});
