import React from "react";
import { useStoreState, useStoreDispatch } from "easy-peasy";
import { withStyles, makeStyles } from "@material-ui/core/styles";
// MENU COMPOSITION
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
/* SOCIAL BUTTONS */
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import LocalMallTwoToneIcon from "@material-ui/icons/LocalMallTwoTone";
import IconButton from "@material-ui/core/IconButton";
import RegisterButton from "../../buttons/navbar-dropdown/RegisterButton";
import EmailAuth from "../../buttons/navbar-dropdown/EmailAuth";
import GoogleAuth from "../../buttons/navbar-dropdown/social-buttons/GoogleAuth";
import FacebookAuth from "../../buttons/navbar-dropdown/social-buttons/FacebookAuth";
import InstagramAuth from "../../buttons/navbar-dropdown/social-buttons/InstagramAuth";
/* END SOCIAL BUTTONS */
// END MENU COMPOSITION

// ICONS
// END ICONS

const useStyles = makeStyles({
    root: {
        color: "var(--mainYellow)",
    },
});

const StyledMenu = withStyles({
    paper: {
        padding: "0 5px",
        border: "2px solid var(--mainYellow)",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        padding: 0,
        width: "100%",
        margin: "auto",
        "&:focus": {
            backgroundColor: "var(--primary-red)",
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function UserDropDown() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const classes = useStyles();
    // Redux
    // > Set State
    const isUserAuthenticated = useStoreState(
        (state) => state.authReducer.cases.isUserAuthenticated
    );
    // > Dispatch Actions to Reducer
    const dispatch = useStoreDispatch();
    // End Redux

    return (
        <div style={{ float: "right" }}>
            {/* Icon login */}
            <IconButton
                href=""
                className="no-outline"
                style={{ color: "var(--mainWhite)" }}
                onClick={handleClick}
            >
                <i className="fas fa-user-friends" />
            </IconButton>
            {/* Icon login */}

            {isUserAuthenticated ? (
                <StyledMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <h1 className="text-center text-main-container">
                        Seja Bem-Vindo(a)!
                    </h1>
                    <StyledMenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <AccountCircleTwoToneIcon
                                fontSize="large"
                                classes={{ root: classes.root }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Minha Conta" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <LocalMallTwoToneIcon
                                fontSize="large"
                                classes={{ root: classes.root }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Meus Pedidos" />
                    </StyledMenuItem>
                </StyledMenu>
            ) : (
                <StyledMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <h1 className="text-center text-main-container">
                        Conecte-se com
                        <br />a Babadoo
                    </h1>
                    <h2 className="text-center text-sub-container pb-0 pt-3">
                        Novo(a) por aqui?
                    </h2>
                    <StyledMenuItem
                        onClick={() => {
                            handleClose();
                            dispatch({
                                type: "SHOW_MODAL_REGISTER",
                                payload: true,
                            });
                        }}
                    >
                        <RegisterButton />
                    </StyledMenuItem>
                    <div>
                        <h2
                            className="text-sub-container"
                            style={{ textAlign: "center" }}
                        >
                            ou
                        </h2>
                    </div>
                    <StyledMenuItem
                        onClick={() => {
                            handleClose();
                            dispatch({
                                type: "SHOW_MODAL_LOGIN",
                                payload: true,
                            });
                        }}
                    >
                        <EmailAuth />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={handleClose}>
                        <GoogleAuth />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={handleClose}>
                        <FacebookAuth />
                    </StyledMenuItem>
                    <StyledMenuItem
                        onClick={() => {
                            handleClose();
                            dispatch({
                                type: "SHOW_MODAL_UNDER_CONSTRUCTION",
                                payload: true,
                            });
                        }}
                    >
                        <InstagramAuth />
                    </StyledMenuItem>
                </StyledMenu>
            )}
        </div>
    );
}
