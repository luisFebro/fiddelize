export default function RadiusBtn({
    title,
    onClick,
    className,
    backgroundColor,
    color,
    fontSize,
    padding,
    needTxtShadow = true,
    size = "normal",
    position,
    top,
    left,
    right,
    bottom,
    display,
    zIndex,
}) {
    const styles = {
        btn: {
            position,
            top,
            left,
            right,
            display: display || "block",
            color: color || "white",
            padding: padding || "2px 8px",
            borderRadius: "20px",
            backgroundColor: backgroundColor || "var(--themeSDark)",
            outline: "none",
            fontSize: fontSize || "20px",
            zIndex,
        },
    };

    const extraSmallConfig = {
        position,
        top,
        left,
        right,
        bottom,
        color: "white",
        padding: "2px 5px",
        borderRadius: "20px",
        backgroundColor: backgroundColor || "var(--themeSDark)",
        outline: "none",
        fontSize: "12px",
        zIndex,
    };

    if (size === "small") {
        className = "";
        fontSize = "15px";
    }

    if (size === "extra-small") {
        styles.btn = extraSmallConfig;
    }

    if (size === "compact") {
        styles.btn = {
            ...extraSmallConfig,
            padding: "2px 7px",
            fontSize: "16px",
        };
    }

    return (
        <button
            className={`${className} text-small ${
                needTxtShadow ? "text-shadow" : ""
            } font-weight-bold cursor-pointer`}
            style={{
                ...styles.btn,
                borderWidth: 2,
                borderStyle: "outset",
                borderColor: "white",
            }}
            onClick={onClick}
            type="button"
        >
            {title}
        </button>
    );
}
