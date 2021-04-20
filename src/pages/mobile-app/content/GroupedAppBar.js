import BarChartIcon from "@material-ui/icons/BarChart";
import StarsIcon from "@material-ui/icons/Stars";
import HomeIcon from "@material-ui/icons/Home";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import BottomTabs from "../../../components/tabs/BottomTabs";
// import SessionOut from "./session-out/SessionOut";
import LoadableVisible from "../../../components/code-splitting/LoadableComp";
// const AsyncSessionIn = LoadableVisible({
//     loader: () =>
//         import(
//             "./session-in/SessionIn" /* webpackChunkName: "in-app-bar-session-lazy" */
//         ),
// });

export default function GroupedAppBar() {
    const data = [
        {
            tabLabel: "Início",
            tabIcon: <HomeIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Modo",
            tabIcon: <SportsEsportsIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Compras",
            tabIcon: <LocalMallIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Avalie",
            tabIcon: <StarsIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Ranking",
            tabIcon: <BarChartIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Suporte",
            tabIcon: <QuestionAnswerIcon />,
            tabContentPanel: undefined,
        },
        {
            tabLabel: "Mais",
            tabIcon: <ControlPointIcon />,
            tabContentPanel: undefined,
        },
    ];

    return <BottomTabs data={data} />;
}
