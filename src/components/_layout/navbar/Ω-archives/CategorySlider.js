import { Component } from "react";
import Slider from "react-slick";
import { HashLink } from "react-router-hash-link";
import "../../carousels/_slick.css";
import "../../carousels/_slickTheme.css";
import styled from "styled-components";
import { productCategories } from "../../../data/dataIcons";
import { floatIt } from "../../../keyframes/floatIt";

export default class CategorySlider extends Component {
    constructor() {
        super();
        this.state = {
            isCarouselOpen: false,
        };
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            className: "center",
            centerPadding: "60px",
            slidesToShow: 5,
            autoplay: true,
            speed: 600,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        centerPadding: "60px",
                        infinite: true,
                        dots: true,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        centerPadding: "60px",
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                    },
                },
            ],
        };

        const { isCarouselOpen } = this.state;

        return (
            <div
                style={{
                    backgroundColor: "rgba(242, 38, 19, .7)",
                    marginBottom: "20px",
                }}
            >
                <h3 className="title-carousel text-center text-capitalize bg-danger">
                    Categorias
                    <SpanWrapper
                        style={{ backgroundColor: "var(--mainYellow)" }}
                        className="ml-3 shadow-elevation badge badge-pill"
                        onClick={() =>
                            this.setState({ isCarouselOpen: !isCarouselOpen })
                        }
                    >
                        {isCarouselOpen ? "x" : "abrir"}
                    </SpanWrapper>
                </h3>
                <Slider
                    style={{
                        transition: ".5s",
                        display: isCarouselOpen ? "block" : "none",
                    }}
                    {...settings}
                >
                    {productCategories.map((card) => (
                        <div key={card.id} className="card-carousel">
                            <HashLink smooth to={`${card.link}`}>
                                <button className="categoryBtn shadow-elevation">
                                    <div className="main-letters-shadow">
                                        <span>
                                            <img
                                                className="img-fluid"
                                                src={`img/icons/${card["img-name"]}`}
                                                alt={`categoria ${card["title-alt"]}`}
                                            />
                                        </span>
                                        <h3 className="text-capitalize">
                                            {card["title-alt"]}
                                        </h3>
                                    </div>
                                </button>
                            </HashLink>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
}

const SpanWrapper = styled.span`
    cursor: pointer;
    margin-bottom: 5px;
    animation: ${floatIt} 1s linear 0s 20;
`;
