import Badge from "@material-ui/core/Badge";
import getItems from "init/lStorage";

const [themeBackColor] = getItems("bizData", ["themeBackColor"]);

export default function DotBadge({ children, invisible = false }) {
    const border = `var(--themeBackground--${themeBackColor})`;
    const notifBackColor =
        themeBackColor === "red"
            ? "var(--themePLight--black)"
            : "var(--expenseRed)";

    return (
        <section className="dot-badge--root">
            <Badge
                invisible={invisible}
                variant="dot"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                {children}
                <style jsx global>
                    {`
                        .dot-badge--root .MuiBadge-badge {
                            background-color: ${notifBackColor} !important;
                            border: 3px solid ${border} !important;
                        }

                        .dot-badge--root .MuiBadge-dot {
                            height: 16px;
                            padding: 0;
                            min-width: 16px;
                            border-radius: 8px;
                        }

                        .dot-badge--root
                            .MuiBadge-anchorOriginBottomRightRectangle {
                            right: 5px;
                            bottom: 5px;
                        }
                    `}
                </style>
            </Badge>
        </section>
    );
}
