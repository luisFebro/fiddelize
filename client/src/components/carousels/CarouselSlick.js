// ⚠ Need also install slick-carousel for css and font
import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import './_slick.css';
import './_slickTheme.css';
import { productCategories } from './dataIcons';

export default function CarouselSlick({
    autoPlay,
    infinite,
    centerMode,
    buttonColor,
    buttonBackground,

}) {
    const [isCarouselOpen, setIsCarouselOpen] = useState(true);
    // const [isSelected, setIsSelected] = useState("");

    const settings = {
        // dots: true,
        infinite: infinite || false,
        // className: 'center',
        // centerPadding: "60px",
        // centerMode: centerMode || true,
        autoplay: autoPlay || false,
        // speed: 600,
        // autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    // centerPadding: '60px',
                    infinite: true,
                    // dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    // centerPadding: '60px',
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true
                }
            }
        ]
    };

    const styles = {
        root: {
            backgroundColor: 'var(--mainWhite)',
        },
        slider: {
            transition: '.5s',
            display: isCarouselOpen ? 'block' : 'none',
            outline: 'none',
        },
        button: {
            color: buttonColor || 'white',
            background: buttonBackground || 'var(--themePLight)',
            cursor: 'pointer',
            border: 'none',
            minWidth: '11em',
            maxWidth: '11em',
            borderRadius: '15px',
            padding: '10px 15px',
            margin: 0,
            position: 'relative',
            textAlign: 'center',
        }
    }

    return (
        <div style={styles.root}>
            <Slider
                style={styles.slider}
                {...settings}
            >
                {productCategories.map(card => {
                    return (
                        <div
                            key={card.id}
                            className="shake-it no-outline pressed-to-left-long card-carousel d-flex flex-column justify-content-center align-content-item"
                            onClick={null}
                        >
                            <button
                                style={styles.button}
                                className={`shadow-elevation`}
                            >
                                <div className="container-center">
                                    <img
                                        className="img-fluid"
                                        width={90}
                                        src={`${card['img-name']}`}
                                        alt={`categoria ${card['title-alt']}`}
                                    ></img>
                                </div>
                                <p className="mt-5 text-capitalize text-normal text-center">{card['title-alt']}</p>
                            </button>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}

/* ARCHIVES
import { HashLink } from 'react-router-hash-link';
<HashLink smooth to={`${card.link}`}>

</HashLink>
const ButtonWrapper = styled.button`
    & {
      cursor: pointer;
      border: none;
      font-size: 36px;
      line-height: 100px;
      padding: 20px;
      margin: 0;
      position: relative;
      text-align: center;
      transition: .9s;
    }

    &:focus {
        outline: none;
    }
`;

<h3 className="title-carousel text-center text-capitalize bg-danger">
    Categorias
    <SpanWrapper
        style={{ backgroundColor: 'var(--mainYellow)' }}
        className="ml-3 shadow-elevation badge badge-pill"
        onClick={() => this.setState({ isCarouselOpen: !isCarouselOpen })}
    >
        {isCarouselOpen ? 'x' : 'abrir'}
    </SpanWrapper>
</h3>
*/
