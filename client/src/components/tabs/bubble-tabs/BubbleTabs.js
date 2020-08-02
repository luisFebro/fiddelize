import React from 'react';
import './_BubbleTabs.scss';
import parse from 'html-react-parser';
import addDashesToString from '../../../utils/string/addDashesToString';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';

export default function BubbleTabs({
    firstLabel = "I am label 1",
    secondLabel = "I am label 2",
    FirstComp,
    SecondComp,
    ctaTitle,
}) {

    const firstLabelId = addDashesToString(firstLabel);
    const secondLabelId = addDashesToString(secondLabel);
    firstLabel = parse(firstLabel);
    secondLabel = parse(secondLabel);

    function openTab(evt, component) {
        // reference: https://www.w3schools.com/howto/howto_js_tabs.asp
        let i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("nav-link");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(component).style.display = "block";
        evt.currentTarget.className += " active";
    }

    const showNavButtons = () => (
        <ul className="nav nav-pills">
            <li className="nav-item">
                <a
                    className="nav-link font-site active"
                    onClick={e => openTab(e, firstLabelId)}
                >
                    {firstLabel}
                </a>
            </li>
            <li className="nav-item">
                <a
                    className="nav-link font-site"
                    onClick={e => openTab(e, secondLabelId)}
                >
                    {secondLabel}
                </a>
            </li>
        </ul>
    );

    const showTabPanes = () => (
        <section className="d-flex justify-content-center">
            <section id={firstLabelId} className="tab-content active">
                <div className="tab-pane">
                    {FirstComp}
                </div>
            </section>
            <section id={secondLabelId} className="tab-content">
                <div className="tab-pane">
                    {SecondComp}
                </div>
            </section>
        </section>
    );

    const showCTAButton = () => (
        ctaTitle &&
        <section className="container-center">
            <ButtonFab
                size="large"
                title={ctaTitle}
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
                top={-30}
                zIndex={2000}
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