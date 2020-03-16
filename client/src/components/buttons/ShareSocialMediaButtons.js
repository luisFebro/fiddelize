import React from 'react';
import { InlineShareButtons } from 'sharethis-reactjs';
import PropTypes from 'prop-types';

ShareSocialMediaButtons.propTypes = {
    data: PropTypes.shape({
        titleShare: PropTypes.string.isRequired,
        pageURL: PropTypes.string.isRequired,
        pageImg: PropTypes.string,
        pageTitle: PropTypes.string,
        pageDescription: PropTypes.string,
    }),
    config: PropTypes.shape({
        alignment: PropTypes.string,
        padding: PropTypes.number,
        radius: PropTypes.number,
        size: PropTypes.number,
        marginTop: PropTypes.string,
        titleShareSize: PropTypes.string,
    })
};

export default function ShareSocialMediaButtons({ data, config = {} }) { // n1
    const { titleShare, pageURL, pageImg, pageTitle, pageDescription } = data;
    const { alignment, padding, radius, size, marginTop, titleShareSize } = config;

    return (
        <div>
            <h2 style={{fontSize: `${titleShareSize}` }} className={`${marginTop || "mt-5"} text-${alignment || 'center'}`}>{titleShare}</h2>
            <InlineShareButtons
                config={{
                    style: {filter: 'drop-shadow(.001em .1em .1em var(--mainDark))'},
                    alignment: alignment || 'center', // alignment of buttons (left, center, right)
                    color: 'social', // set the color of buttons (social, white)
                    enabled: true, // show/hide buttons (true, false)
                    font_size: 25, // font size for the buttons
                    labels: 'null', // button labels (cta, counts, null)
                    language: 'pt', // which language to use (see LANGUAGES)
                    networks: [ // opt 'sms', 'facebook', 'email', 'whatsapp', 'messenger', 'twitter'
                        'email', 'whatsapp', 'sms', 'messenger',
                    ],
                    padding: padding || 12,
                    radius: radius || 4,
                    size: size || 45,

                    // PARAMETERS FROM PROPS
                    url: `${pageURL}`, // (defaults to current url)
                    image: `${pageImg}`, //"https://i.imgur.com/9GjtAiW.png", // (defaults to og:image or twitter:image)
                    title: `${pageTitle}`, // (defaults to og:title or twitter:title)
                    description: `${pageDescription}`, // (defaults to og:description or twitter:description)
                    subject: `${pageTitle}`, // (only for email sharing)
                    message: `${pageDescription}`, // (only for email sharing)
                    username: '@testingTwitter' // (only for twitter sharing)
                }}
            />
        </div>
    );
}

/* COMMENTS
n1:
LESSONS:
1) use a propDefault like prop = {} if you destructuringobject's properties without a loadingIndicator/Skeleton
2) watch out with primitive types: padding = undefined `${padding || 30}`= "30"| padding || 30 = 30

*/