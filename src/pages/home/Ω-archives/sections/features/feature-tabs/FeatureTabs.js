import { useState } from "react";
import "./_Tabs.scss";
import TabsContent from "./TabsContent";

export default function FeatureTabs({ tabsData = [] }) {
    const [currTab, setCurrTab] = useState(tabsData && tabsData[0].tabsName);

    const showTabsLinks = () => {
        const getTab = ({ id = 1, name, Icon = null }) => (
            <li className="nav-item" key={id}>
                <a
                    className={`nav-link ${currTab === name ? "active" : ""}`}
                    id={`nav-tab-${id}`}
                    data-toggle="tab"
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrTab(name);
                    }}
                    role="tab"
                    aria-controls={`tab-${id}`}
                    aria-selected="true"
                >
                    {Icon} {name}
                </a>
            </li>
        );

        return (
            <ul className="nav nav-tabs" id="templateTabs" role="tablist">
                {tabsData.map((t, ind) =>
                    getTab({
                        id: ind + 1,
                        name: t.tabsName,
                        Icon: t.Icon,
                    })
                )}
            </ul>
        );
    };

    return (
        <div className="row">
            {showTabsLinks()}
            <TabsContent tabsData={tabsData} currTab={currTab} />
        </div>
    );
}
