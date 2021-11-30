import { Fragment } from "react";

export default function UserInfoCard() {
    return (
        <Fragment>
            <div class="col-12 col-md-5 col-lg-4 col-xl-3 px-4 px-sm-5 px-lg-4 user-profile">
                <div class="user-profile__close d-flex d-xl-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="svg-icon"
                        viewBox="0 0 38.8 38.9"
                    >
                        <g>
                            <path
                                d="M2,38.9a1.9,1.9,0,0,1-1.4-.5,2.1,2.1,0,0,1,0-2.9L35.4.6a1.9,1.9,0,0,1,2.8,0,1.9,1.9,0,0,1,0,2.8L3.4,38.4A1.9,1.9,0,0,1,2,38.9Z"
                                fill="#d87232"
                            />
                            <path
                                d="M36.8,38.9a1.9,1.9,0,0,1-1.4-.5L.6,3.4A1.9,1.9,0,0,1,.6.6,1.9,1.9,0,0,1,3.4.6L38.2,35.5a2.1,2.1,0,0,1,0,2.9A1.9,1.9,0,0,1,36.8,38.9Z"
                                fill="#d87232"
                            />
                        </g>
                    </svg>
                </div>
                <div class="user-profile__wrapper">
                    <div class="user-profile__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/women/56.jpg"
                            alt="Jenny Smith"
                            loading="lazy"
                        />
                    </div>
                    <div class="user-profile__details mt-1">
                        <span class="user-profile__name">Jenny Smith</span>
                        <span class="user-profile__phone">
                            (025) 015-234-567
                        </span>
                        <span class="user-profile__location">
                            New York, United States
                        </span>
                    </div>
                    <div class="user-profile__description">
                        <p>
                            Fly me to the moon 🌙 If you feel like your life is
                            a routine, step back and take a deep breath.
                        </p>
                    </div>
                    <div class="user-profile__learning mt-4">
                        <span class="user-profile__label">Social Medias</span>
                        <ul class="user-profile__tags user-profile__tags--primary mt-2">
                            <li>
                                <a
                                    href="https://www.instagram.com/tiantsoa_sh/"
                                    target="_blank"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/tiantsoa-rabemananjara-254655152/"
                                    target="_blank"
                                >
                                    Linkedin
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://codepen.io/tiantsoa"
                                    target="_blank"
                                >
                                    Codepen
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="user-profile__hobbies">
                        <span class="user-profile__label">Activities</span>
                        <ul class="user-profile__tags user-profile__tags--secondary mt-2">
                            <li>Biking</li>
                            <li>Cooking</li>
                            <li>Traveling</li>
                            <li>Grahic design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
