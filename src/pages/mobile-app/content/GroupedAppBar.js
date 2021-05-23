import { withRouter } from "react-router-dom";
import BarChartIcon from "@material-ui/icons/BarChart";
import StarsIcon from "@material-ui/icons/Stars";
import useData, { useBizData } from "init";
// import HomeIcon from "@material-ui/icons/Home";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useContext from "context";
import BottomTabs from "components/tabs/BottomTabs";
import LoadableVisible from "components/code-splitting/LoadableComp";
// Contents
import Games from "./bottom-menu-contents/all-games/Games";

const AsyncMoreOptionsMenu = LoadableVisible({
    loading: false,
    loader: () =>
        import(
            "./bottom-menu-contents/MoreOptionsMenu" /* webpackChunkName: "more-options-app-bar-content-lazy" */
        ),
});

const AsyncPurchaseHistory = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./bottom-menu-contents/purchase-history/PurchaseHistory" /* webpackChunkName: "purchase-history-content-lazy" */
        ),
});

const AsyncReceivedBenefits = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./bottom-menu-contents/received-benefits/ReceivedBenefits" /* webpackChunkName: "received-benefits-content-lazy" */
        ),
});

const AsyncBizReview = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./bottom-menu-contents/biz-review/BizReview" /* webpackChunkName: "biz-review-content-lazy" */
        ),
});

function GroupedAppBar({ history }) {
    const { firstName, userId, totalGeneralPoints } = useData();

    const { themePColor: colorP, themeBackColor: colorBack } = useBizData();

    const { needAppForCliAdmin, didUserScroll } = useContext();

    const cliUserBuyData = {
        cliUserFirstName: firstName,
        cliUserId: userId,
        totalGeneralPoints,
        isFromDashboard: false,
    };

    const data = [
        {
            tabLabel: "Jogo",
            tabIcon: <SportsEsportsIcon />,
            tabContentPanel: <Games />,
            scrollView: true,
            colorBack,
        },
        {
            tabLabel: "Compras",
            tabIcon: <LocalMallIcon />,
            tabContentPanel: <AsyncPurchaseHistory {...cliUserBuyData} />,
            scrollView: true,
        },
        {
            tabLabel: "Ganhos",
            tabIcon: (
                <FontAwesomeIcon
                    icon="trophy"
                    style={{ fontSize: 19, marginBottom: "12px" }}
                />
            ),
            tabContentPanel: <AsyncReceivedBenefits />,
            scrollView: true,
        },
        {
            tabLabel: "Cartão",
            tabIcon: <CardGiftcardIcon />,
            tabContentPanel: undefined,
            scrollView: false,
            onClick: () => {
                const path = needAppForCliAdmin
                    ? "/cartao-virtual?client-admin=1"
                    : "/cartao-virtual";
                history.push(path);
            },
        },
        {
            tabLabel: "Avalie",
            tabIcon: <StarsIcon />,
            tabContentPanel: <AsyncBizReview />,
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
            colorP,
            colorBack,
        },
    ];

    return <BottomTabs data={data} showAppBar={didUserScroll} />;
}

export default withRouter(GroupedAppBar);

/* ARCHIVES

{
    tabLabel: "Ranking",
    tabIcon: <BarChartIcon />,
    tabContentPanel: undefined,
    scrollView: true,
},

 */
