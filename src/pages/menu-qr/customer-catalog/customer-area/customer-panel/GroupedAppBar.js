import AssignmentIcon from "@material-ui/icons/Assignment";
import BuildIcon from "@material-ui/icons/Build";
import useContext from "context";
import BottomTabs from "components/tabs/BottomTabs";
import OnlineGamesHandler from "./online-games-content/OnlineGamesHandler";
// import LoadableVisible from "components/code-splitting/LoadableComp";

// const AsyncMoreOptionsMenu = LoadableVisible({
//     loading: false,
//     loader: () =>
//         import(
//             "./bottom-menu-contents/MoreOptionsMenu" /* webpackChunkName: "more-options-app-bar-content-lazy" */
//         ),
// });

export default function GroupedAppBar() {
    const { backColor } = useContext();

    const data = [
        {
            tabLabel: "Promoção",
            tabIcon: <p className="font-weight-bold text-em-1-4">%</p>,
            tabContentPanel: <OnlineGamesHandler />,
            scrollView: true,
            colorBack: backColor,
        },
        {
            tabLabel: "Pedidos",
            tabIcon: <AssignmentIcon />,
            tabContentPanel: null,
            scrollView: true,
            colorBack: backColor,
        },
        {
            tabLabel: "Ajustes",
            tabIcon: <BuildIcon />,
            tabContentPanel: null,
            scrollView: true,
            colorBack: backColor,
            // colorP,
        },
    ];

    // isPreviewMode is false because we have a touching issue. The demo app is frozen right after the bottom tabs pops up.
    return (
        <BottomTabs data={data} showAppBar needTabFullWidth tabsColor="black" />
    );
}
