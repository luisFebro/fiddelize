import BarChartIcon from "@material-ui/icons/BarChart";
import StarsIcon from "@material-ui/icons/Stars";
// import HomeIcon from "@material-ui/icons/Home";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import BottomTabs from "../../../components/tabs/BottomTabs";
// import SessionOut from "./session-out/SessionOut";
import LoadableVisible from "../../../components/code-splitting/LoadableComp";
import { withRouter } from "react-router-dom";

const AsyncMoreOptionsMenu = LoadableVisible({
    loading: false,
    loader: () =>
        import(
            "./bottom-menu-contents/MoreOptionsMenu" /* webpackChunkName: "more-options-app-bar-content-lazy" */
        ),
});

function GroupedAppBar({ history }) {
    const data = [
        {
            tabLabel: "Jogo",
            tabIcon: <SportsEsportsIcon />,
            tabContentPanel: undefined,
            scrollView: true,
        },
        {
            tabLabel: "Cartão",
            tabIcon: <CardGiftcardIcon />,
            tabContentPanel: undefined,
            scrollView: false,
            onClick: () => history.push("/cartao-virtual"),
        },
        {
            tabLabel: "Compras",
            tabIcon: <LocalMallIcon />,
            tabContentPanel: undefined,
            scrollView: true,
        },
        {
            tabLabel: "Ranking",
            tabIcon: <BarChartIcon />,
            tabContentPanel: undefined,
            scrollView: true,
        },
        {
            tabLabel: "Avalie",
            tabIcon: <StarsIcon />,
            tabContentPanel: undefined,
            scrollView: true,
        },
        {
            tabLabel: "Suporte",
            tabIcon: <QuestionAnswerIcon />,
            tabContentPanel: undefined,
            scrollView: true,
        },
        {
            tabLabel: "Mais",
            tabIcon: <ControlPointIcon />,
            tabContentPanel: <AsyncMoreOptionsMenu history={history} />,
            scrollView: true,
        },
    ];

    return <BottomTabs data={data} />;
}

export default withRouter(GroupedAppBar);
