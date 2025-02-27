import React from "react";
// import IconButton from '@material-ui/core/IconButton';
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

NotificationBadge.propTypes = {
    badgeValue: PropTypes.number.isRequired,
    children: PropTypes.element,
    padding: PropTypes.string,
    fontSize: PropTypes.string,
    right: PropTypes.number,
    top: PropTypes.number,
};

function NotificationBadge({
    children,
    padding,
    fontSize,
    badgeValue = 0,
    backgroundColor,
    borderColor,
    right,
    top,
    onClick,
    animationName = "zoomIn",
    // badgeInvisible,
}) {
    const BorderedBadge = withStyles((theme) => ({
        badge: {
            right: right || 0, // 14
            top: top || 1, // 18
            height: 0,
            maxWidth: "14px",
            padding: padding || "14px",
            border: `3px solid ${borderColor || "var(--mainDark)"}`,
            font: `bold ${fontSize || "20px"} var(--mainFont)`,
            backgroundColor: backgroundColor || "var(--themeSDark)",
            color: "white",
            borderRadius: "50%",
            textShadow: "1px 1px 3px black",
            animationName,
            animationDuration: "1s",
        },
    }))(Badge);

    return (
        <BorderedBadge
            badgeContent={badgeValue}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            invisible={!badgeValue}
            showZero={false}
            max={99}
            overlap="rectangle"
            variant="standard"
            onClick={onClick}
        >
            {children}
        </BorderedBadge>
    );
}

export default React.memo(NotificationBadge);
/* ARCHIVES
// const [invisible, setInvisible] = useState(true);

// useEffect(() => {
//     let runSetInvisible = setTimeout(() => setInvisible(false), 2000);
//     return () => { clearTimeout(runSetInvisible) };
// }, [])

// useEffect(() => {
//     badgeInvisible && setInvisible(true);
// }, [badgeInvisible])
*/

/* REFERENCES - babadoo
<IconButton href="" className="no-outline" style={{color: 'var(--mainWhite)'}} onClick={handleClick}>
    <BorderedBadge className="animated bounce slow" badgeContent={allMessagesList.length}>
        <NotificationsIcon className="icon-svg" />
    </BorderedBadge>
</IconButton>
<StyledMenu id="customized-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
    {allMessagesList.length === 0 ? (
        ...
*/
