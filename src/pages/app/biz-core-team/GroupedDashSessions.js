// Icons from Tabs
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
// import BuildIcon from "@material-ui/icons/Build";
import TabSessions from "components/tabs/TabSessions";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import Icon from "styles/Icon";
import useData from "init";
import NotificationBadge from "components/badges/NotificationBadge";
import useAPI, { readSupportRecentData } from "api/useAPI";
import DashSales from "./dash-sales/DashSales";

// const AsyncDashCRM = LoadableVisible({
//     loader: () =>
//         import("./dash-crm/DashCRM" /* webpackChunkName: "crm-session-lazy" */),
// });

const AsyncSupportCenter = LoadableVisible({
    loader: () =>
        import(
            "./dash-support/SupportCenter" /* webpackChunkName: "support-center-session-lazy" */
        ),
});

const muStyle = {
    fontSize: 35,
};

const getData = ({ isDev, pendingSubjectCount }) =>
    isDev
        ? [
              {
                  tabLabel: "Ganhos",
                  tabIcon: <MonetizationOnIcon style={muStyle} />,
                  tabContentPanel: <DashSales />,
              },
              {
                  tabLabel: "Suporte",
                  tabIcon: (
                      <div className="position-relative">
                          <NotificationBadge
                              animationName=" "
                              badgeValue={pendingSubjectCount}
                              badgeInvisible={false}
                              backgroundColor="var(--mainRed)"
                              borderColor="var(--themePLight--red)"
                              top={20}
                              right={-25}
                              fontSize="17px"
                              padding="15px"
                          >
                              <Icon type="support" fill="grey" />
                          </NotificationBadge>
                      </div>
                  ),
                  tabContentPanel: <AsyncSupportCenter />,
              },
              // {
              //     tabLabel: "Clientes",
              //     tabIcon: <ContactPhoneIcon style={muStyle} />,
              //     tabContentPanel: <AsyncDashCRM />,
              // },
          ]
        : [
              {
                  tabLabel: "Ganhos",
                  tabIcon: <MonetizationOnIcon style={muStyle} />,
                  tabContentPanel: <DashSales />,
              },
          ];

export default function GroupedDashSessions() {
    const { agentJob, userId } = useData();

    const { data: dataRecentSupport } = useAPI({
        url: readSupportRecentData(),
        params: { userId }, // for auth only
        needAuth: true,
        needOnlyOnce: true,
    });

    const pendingSubjectCount =
        dataRecentSupport && dataRecentSupport.pendingSubjectCount;

    const isDev = agentJob === "dev";
    const data = getData({ isDev, pendingSubjectCount });
    return <TabSessions data={data} needTabFullWidth />;
}

/*
{
    tabLabel: "Ajustes",
    tabIcon: <BuildIcon style={muStyle} />,
    tabContentPanel: <AsyncAdjusts />,
    boxPadding: 1,
},
 */
