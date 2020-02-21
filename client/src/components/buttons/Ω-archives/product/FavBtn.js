import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import animateCSS from '../../../utils/animateCSS';
import uuidv1 from 'uuid/v1';
// Redux
import customMsg from '../../../utils/customMsg';
import { showSnackbar } from '../../../redux/actions/snackbarActions';
import { showModalRegister } from '../../../redux/actions/modalActions';
import { addElemArrayUser, removeElemArrayUser } from '../../../redux/actions/userActions';

FavBtn.propTypes = {
    productId: PropTypes.string.isRequired,
    isFavBtnOn: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    setRun: PropTypes.func,
    run: PropTypes.bool,
    animationRef: PropTypes.object,
    btnConfig: PropTypes.shape({
        size: PropTypes.string
    })
}

export default function FavBtn({
        productId,
        isFromFavPage = false,
        isFavBtnOn = true,
        showSkeleton,
        setRun = f => f,
        animationRef,
        btnConfig = {} }) {
    const [toggle, setToggle] = useState(false);
    const { size } = btnConfig;

    const { isUserAuthenticated, _idUser, favItemIds, name } = useStoreState(state => ({
        isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
        _idUser: state.userReducer.cases.currentUser['_id'],
        name: state.userReducer.cases.currentUser.name,
        favItemIds: state.userReducer.cases.currentUser.favoriteList,
    }));
    const dispatch = useStoreDispatch();

    const isFavItem = (favItemIds, productId) => {
        let isThisFav;
        favItemIds
        ? (favItemIds.includes(productId) ? isThisFav = true : isThisFav = false)
        : isThisFav = false

        return isThisFav;
    }

    const toggleFav = () => {
        setToggle(!toggle);
    };

    const showFavBtn = isFavBtnOn => {
        if(!isFavBtnOn) return null;

        const bodyFavorite = {
            userId: _idUser,
            changeField: { favoriteList: productId }
        }

        const handleFavOn = () => (
            <Fragment>
                {showSkeleton
                ? <Skeleton variant="circle" width={30} height={30} />
                : (
                    <i
                        className="filledHeart fas fa-heart animated heartBeat fast"
                        style={{
                            animationIterationCount: 3,
                            fontSize: size || "1.7rem",
                        }}
                        onClick={() => {
                            showSnackbar(dispatch, "Removendo...");
                            removeElemArrayUser(dispatch, bodyFavorite)
                            .then(res => {
                                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                                showSnackbar(dispatch, customMsg(`${res.data.msg} dos seus Favoritos`, name, 'removed'))
                                isFromFavPage && animateCSS(animationRef, 'zoomOutUp', 'slow', setRun(uuidv1()));
                            })
                        }}
                    ></i>
                )}
            </Fragment>
        );

        const handleFavOff = () => (
            <Fragment>
                {showSkeleton
                ? <Skeleton variant="circle" width={30} height={30} />
                : (
                    <i
                    className="emptyHeart far fa-heart"
                    style={{ fontSize: size || "1.7rem" }}
                    onClick={() => {
                        showSnackbar(dispatch, "Adicionando...");
                        addElemArrayUser(dispatch, bodyFavorite) //n2
                        .then(res => {
                            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                            showSnackbar(dispatch, customMsg(`Adicionado aos seus Favoritos`, name), 'success');
                        })
                    }}
                    ></i>
                )}
            </Fragment>
        );

        const handleNoLoggedUser = () => (
            <i
                className="emptyHeart far fa-heart"
                onClick={() => {
                    showModalRegister(dispatch);
                    showSnackbar(
                        dispatch,
                        'Faça seu acesso para adicionar aos favoritos!'
                    );
                }}
            ></i>
        );

        const getsyncData = isFavItem => { // n1
            if(isFavItem(favItemIds, productId)) {
                return toggle || isFavItem(favItemIds, productId)
            } else {
                return toggle && isFavItem(favItemIds, productId)
            }
        }

        return(
            <button style={{outline: "none"}} className="cart-fav" onClick={() => toggleFav()}>
                {isUserAuthenticated ? (
                    (getsyncData(isFavItem))
                    ? handleFavOn()
                    : handleFavOff()
                ) : (
                    handleNoLoggedUser()
                )}
            </button>
        );
    };

    return (
        <FavWrapper>
            {showFavBtn(isFavBtnOn)}
        </FavWrapper>
    );
}

const FavWrapper = styled.div`
    .cart-fav {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
    }

    .cart-fav i {
        color: var(--mainRed);
        font-size: 1.7rem;
        transition: .5s;
    }

    .cart-fav .emptyHeart {
        opacity: .3;
    }

    .cart-fav .filledHeart {
        opacity: 1;
        transform: scale(1.1);
    }

    .cart-fav .emptyHeart:hover {
        opacity: 1;
        transform: scale(1.1);
    }

`;

/* COMMENTS
n1:
This logic allows us to toggle quickly and update in the database in the same time. toggle && function part forces to deactivate the option even if it is "true" in the database.
Another advantage is that the update getAllProducts(dispatch) method is no longer required.
this also garantees the button is toggled off properly.
n2: run and display to add as soon as possible
*/