import "./_BubbleTabs.scss";
import parse from "html-react-parser";
import addDashesToString from "../../../utils/string/addDashesToString";
import ButtonFab from "../../buttons/material-ui/ButtonFab";
import { setRun, useAction } from "global-data/ui";

export default function BubbleTabs({
    firstLabel = "I am label 1",
    secondLabel = "I am label 2",
    firstName,
    secondName,
    FirstComp,
    SecondComp,
    ctaTitle,
    ctaAction,
    setWhichTab,
}) {
    const firstLabelId = addDashesToString(firstLabel);
    const secondLabelId = addDashesToString(secondLabel);
    firstLabel = parse(firstLabel);
    secondLabel = parse(secondLabel);

    const uify = useAction();

    function openTab(evt, component) {
        // reference: https://www.w3schools.com/howto/howto_js_tabs.asp
        let i;
        let tabcontent;
        let tablinks;

        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("nav-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(
                " active",
                ""
            );
        }

        document.getElementById(component).style.display = "block";
        evt.currentTarget.className += " active";
    }

    const showNavButtons = () => (
        <ul className="nav nav-pills">
            <li className="nav-item">
                <a
                    id="bubbleTabsBtn1"
                    className="nav-link font-site active"
                    onClick={(e) => {
                        if (typeof setWhichTab === "function") {
                            setWhichTab(firstName);
                            setRun("runName", firstName, uify);
                        }
                        openTab(e, firstLabelId);
                    }}
                >
                    {firstLabel}
                </a>
            </li>
            <li className="nav-item">
                <a
                    id="bubbleTabsBtn2"
                    className="nav-link font-site"
                    onClick={(e) => {
                        if (typeof setWhichTab === "function") {
                            setWhichTab(secondName);
                            setRun("runName", secondName, uify);
                        }
                        openTab(e, secondLabelId);
                    }}
                >
                    {secondLabel}
                </a>
            </li>
        </ul>
    );

    const showTabPanes = () => (
        <section className="d-flex justify-content-center">
            <section id={firstLabelId} className="tab-content active">
                <div className="tab-pane">{FirstComp}</div>
            </section>
            <section id={secondLabelId} className="tab-content">
                <div className="tab-pane">{SecondComp}</div>
            </section>
        </section>
    );

    const showCTAButton = () =>
        ctaTitle && (
            <section className="container-center">
                <ButtonFab
                    size="large"
                    title={ctaTitle}
                    onClick={ctaAction}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                    top={-30}
                />
            </section>
        );

    return (
        <section className="bubble-tabs--root">
            {showNavButtons()}
            {showTabPanes()}
            {showCTAButton()}
        </section>
    );
}
