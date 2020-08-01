import React, { Fragment } from 'react';
import './_BubbleTabs.scss';
import parse from 'html-react-parser';

export default function BubbleTabs({
    firstLabel = "I am label 1",
    secondLabel = "I am label 2",
}) {

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
                    onClick={e => openTab(e, firstLabel)}
                >
                    {firstLabel}
                </a>
            </li>
            <li className="nav-item">
                <a
                    className="nav-link font-site"
                    onClick={e => openTab(e, secondLabel)}
                >
                    {secondLabel}
                </a>
            </li>
        </ul>
    );

    const showTabPanes = () => (
        <Fragment>
            <section id={firstLabel} className="tab-content active">
                <div className="tab-pane">
                    first section
                </div>
            </section>
            <section id={secondLabel} className="tab-content">
                <div className="tab-pane">
                    second section
                </div>
            </section>
        </Fragment>
    );

    return (
        <section className="bubble-tabs--root">
            {showNavButtons()}
            {showTabPanes()}
        </section>
    );
}