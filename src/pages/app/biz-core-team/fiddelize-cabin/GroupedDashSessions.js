// Icons from Tabs
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import TabSessions from "../../../../components/tabs/TabSessions";
import DashGoals from "./dash-goals/DashGoals";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

const AsyncDashMetrics = LoadableVisible({
    loader: () =>
        import(
            "./dash-metrics/DashMetrics" /* webpackChunkName: "cabin-metrics-session-lazy" */
        ),
});

const muStyle = {
    fontSize: 35,
};

export default function GroupedDashSessions({ mainData }) {
    const data = [
        {
            tabLabel: "Objetivos",
            tabIcon: <TrackChangesIcon style={muStyle} />,
            tabContentPanel: <DashGoals />,
        },
        {
            tabLabel: "Métricas",
            tabIcon: <TrendingUpIcon style={muStyle} />,
            tabContentPanel: <AsyncDashMetrics mainData={mainData} />,
        },
    ];

    return <TabSessions data={data} needTabFullWidth />;
}
