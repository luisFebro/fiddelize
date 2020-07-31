import React from 'react';
import './_BubbleTabs.scss';
import parse from 'html-react-parser';

export default function BubbleTabs({
    firstLabel = "I am label 1",
    secondLabel = "I am label 2",
}) {

    firstLabel = parse(firstLabel);
    secondLabel = parse(secondLabel);

    const showNavPills = () => (
        <ul className="nav nav-pills" role="tablist">
          <li className="nav-item">
            <a
                className="nav-link font-site active"
                data-toggle="pill"
                href="#login"
            >
                {firstLabel}
            </a>
          </li>
          <li className="nav-item">
            <a
                className="nav-link font-site"
                data-toggle="pill"
                href="#regis"
            >
                {secondLabel}
            </a>
          </li>
        </ul>
    );

    const showTabPanes = () => (
        <section className="tab-content">
          <div id="login" className="container tab-pane active">

          </div>
        </section>
    );

    return (
        <section className="bubble-tabs--root">
            {showNavPills()}
            {showTabPanes()}
        </section>
    );
}