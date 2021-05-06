import { Component } from "react";
import { Link } from "react-router-dom";
import {
    ButtonContainerPressedEffectDark as DarkBtn,
    ButtonContainerPressedEffectYellow as YellowBtn,
} from "../buttons/Default";
import { ProductConsumer } from "../../data/contexts/mainContext";

export default class Modal extends Component {
    render() {
        return (
            <ProductConsumer>
                {(value) => {
                    const { modalOpen, closeModal } = value;
                    const { image, title, price } = value.modalProduct;
                    if (!modalOpen) {
                        return null;
                    }
                    return (
                        <ModalContainer>
                            <div className="container">
                                <div className="row">
                                    <div
                                        id="modal"
                                        className="col-10 col-md-6 col-lg-4 mx-auto text-center text-capitalize p-5"
                                    >
                                        <h2
                                            className="animated bounce fast mb-2"
                                            style={{
                                                animationIterationCount: "3",
                                            }}
                                        >
                                            <span>
                                                <i className="fas fa-shopping-cart" />
                                            </span>
                                            Item adicionado!
                                        </h2>
                                        <img
                                            src={image}
                                            alt="product"
                                            className="img-fluid shadow-elevation"
                                        />
                                        <section className="my-2">
                                            <h5>{title}</h5>
                                            <h5 className="text-yellow">
                                                preço: R$ {price}
                                            </h5>
                                        </section>
                                        <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                                            <Link to="/">
                                                <DarkBtn
                                                    onClick={() => closeModal()}
                                                >
                                                    Vitrine
                                                </DarkBtn>
                                            </Link>
                                            <Link to="/seu-carrinho">
                                                <YellowBtn
                                                    onClick={() => closeModal()}
                                                >
                                                    Ver
                                                    <span>
                                                        <i
                                                            style={{
                                                                fontSize:
                                                                    "1.7rem",
                                                                color:
                                                                    "var(--mainWhite)",
                                                            }}
                                                            className="fas fa-shopping-cart ml-1"
                                                        />
                                                    </span>
                                                </YellowBtn>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalContainer>
                    );
                }}
            </ProductConsumer>
        );
    }
}

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;

    -index: 1500;
    #modal {
        background: var(--mainWhite);
    }
    .fa-shopping-cart {
        margin-right: 10px;
        color: var(--mainYellow);
        font-size: 2.2rem;
    }
`;
