import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ComputerIcon from "@mui/icons-material/Computer";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import AdjustIcon from "@mui/icons-material/Adjust";
import SupportIcon from "@mui/icons-material/Support";
import Grid from "styles/icons/ion/Grid";
// import Button from '@mui/material/Button';

const dataStore = [
    { txt: "Configuração", icon: <SettingsIcon /> },
    { txt: "Forçar Rede", icon: <NetworkCheckIcon /> },
    { txt: "Configurar APN", icon: <AdjustIcon /> },
    { txt: "Rotear para PC", icon: <ComputerIcon /> },
    { txt: "Fale Conosco", icon: <SupportIcon /> },
];

export default function MuDrawerBtn() {
    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List style={{ backgroundColor: "#00020f" }}>
                {dataStore.map((itemObj) => (
                    <Fragment key={itemObj.txt}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{itemObj.icon}</ListItemIcon>
                                <ListItemText primary={itemObj.txt} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </Fragment>
                ))}
                <style jsx global>
                    {`
                        .MuiListItemIcon-root .MuiSvgIcon-root {
                            fill: rgb(34, 202, 165) !important;
                        }

                        .MuiListItemText-root .MuiTypography-root {
                            color: var(--mainWhite) !important;
                        }

                        .MuiDrawer-paper {
                            background: #00020f !important;
                        }

                        .MuiDivider-root {
                            border-color: rgba(255, 255, 255, 0.4) !important;
                        }

                        .MuiListItemText-root.css-tlelie-MuiListItemText-root {
                            margin-top: 10px !important;
                            margin-bottom: 10px !important;
                        }

                        .MuiListItemIcon-root.css-cveggr-MuiListItemIcon-root {
                            min-width: 45px !important;
                            padding: 0 20px !important;
                        }
                    `}
                </style>
            </List>
        </Box>
    );

    return (
        <Fragment key="left">
            <li className="top-item" onClick={toggleDrawer("left", true)}>
                <a href="#">
                    <span className="icon">
                        <Grid />
                    </span>
                </a>
            </li>
            <Drawer
                anchor="left"
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
                onOpen={toggleDrawer("left", true)}
            >
                {list("left")}
            </Drawer>
        </Fragment>
    );
}
