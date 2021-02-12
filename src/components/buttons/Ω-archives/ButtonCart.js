import React from 'react';
import { Link } from 'react-router-dom';
import { ProductConsumer } from '../../data/contexts/mainContext';
import { ButtonContainerPressedEffectYellow as ButtonYellow } from './Default';

export default function ButtonCart() {
    return (
        <ProductConsumer>
            {value => {
                return (
                    <Link to="/seu-carrinho" className="ml-2 fixed-bottom m-3" style={{ zIndex: 100 }}>
                        <ButtonYellow
                            className="animated tada slower"
                            style={{
                                padding: '7px',
                                position: 'relative',
                                zIndex: 150,
                                animationDelay: '20s',
                                animationIterationCount: 2
                            }}
                        >
                            <span style={{ position: 'relative' }}>
                                <i className="fas fa-shopping-cart p-2" style={{ fontSize: '1.7rem' }}>
                                    <span
                                        className="badge badge-danger animated pulse slow "
                                        style={{
                                            position: 'absolute',
                                            top: '-.5em',
                                            left: '1.6em',
                                            marginLeft: '.01em',
                                            padding: '.9px 3px'
                                        }}
                                    >
                                        {!value.cartTotalItems ? null : value.cartTotalItems}
                                    </span>
                                </i>
                            </span>
                        </ButtonYellow>
                    </Link>
                );
            }}
        </ProductConsumer>
    );
}