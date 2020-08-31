// reference: https://codepen.io/himalayasingh/pen/pxKKgd
import React from 'react';
import './AnimaIconsSelect.scss';

export default function AnimaIconsSelect() {
    const showFieldSelector = () => (
        <section id="select-button" class="brd">
            <div id="selected-value">
                <span>Select a platform</span>
            </div>
            <div id="chevrons">
                <i class="fas fa-chevron-up"></i>
                <i class="fas fa-chevron-down"></i>
            </div>
        </section>
    );

    const showPanelOptions = () => (
        <section id="options">
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="codepen" />
                <input class="s-c bottom" type="radio" name="platform" value="codepen" />
                <i class="fab fa-codepen"></i>
                <span class="label">CodePen</span>
                <span class="opt-val">CodePen</span>
            </div>
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="dribbble"/>
                <input class="s-c bottom" type="radio" name="platform" value="dribbble"/>
                <i class="fab fa-dribbble"></i>
                <span class="label">Dribbble</span>
                <span class="opt-val">Dribbble</span>
            </div>
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="behance" />
                <input class="s-c bottom" type="radio" name="platform" value="behance" />
                <i class="fab fa-behance"></i>
                <span class="label">Behance</span>
                <span class="opt-val">Behance</span>
            </div>
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="hackerrank" />
                <input class="s-c bottom" type="radio" name="platform" value="hackerrank" />
                <i class="fab fa-hackerrank"></i>
                <span class="label">HackerRank</span>
                <span class="opt-val">HackerRank</span>
            </div>
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="stackoverflow" />
                <input class="s-c bottom" type="radio" name="platform" value="stackoverflow" />
                <i class="fab fa-stack-overflow"></i>
                <span class="label">StackOverflow</span>
                <span class="opt-val">StackOverflow</span>
            </div>
            <div class="option">
                <input class="s-c top" type="radio" name="platform" value="freecodecamp" />
                <input class="s-c bottom" type="radio" name="platform" value="freecodecamp" />
                <i class="fab fa-free-code-camp"></i>
                <span class="label">FreeCodeCamp</span>
                <span class="opt-val">FreeCodeCamp</span>
            </div>
            <div id="option-bg"></div>
        </section>
    );

    return (
        <form id="app-cover">
            <section id="select-box">
                <input type="checkbox" id="options-view-button" />
                {showFieldSelector()}
                {showPanelOptions()}
            </section>
        </form>
    );
}



