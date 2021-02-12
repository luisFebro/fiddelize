import React, { useEffect, Fragment } from "react";
import Spinner from "../../../../../components/loadingIndicators/Spinner";
import useDelay from "../../../../../hooks/useDelay";
import CarouselCard from "../../../../../components/carousels/CarouselCard";
import PayMethodsBtn from "./PayMethodsBtn";

const thisData = [
    {
        title: "Cartão de Crédito",
        img: "/img/icons/pay/categories/credit-card-selection.svg",
    },
    {
        title: "Pix",
        img: "/img/icons/pay/categories/pix-selection.png",
    },
    {
        title: "Boleto Automático",
        img: "/img/icons/pay/categories/boleto-selection.svg",
    },
    {
        title: "Débito Bancário",
        img: "/img/icons/pay/categories/bank-debit-selection.png",
    },
];

const CardList = ({ modalData }) => {
    return (
        <Fragment>
            {thisData.map((card) => {
                const ShowIcon = () => (
                    <section className="mb-2 container-center">
                        <img
                            width="120px"
                            height="120px"
                            src={card.img}
                            alt="categorias de pagamento"
                        />
                    </section>
                );

                return (
                    <section
                        key={card.title}
                        className="carousel-cell no-outline"
                    >
                        <p className="m-0 mt-3 text-grey text-normal text-center font-weight-bold">
                            {card.title}
                        </p>
                        <ShowIcon />
                        <section className="container-center">
                            <PayMethodsBtn
                                method={card.title}
                                modalData={modalData}
                            />
                        </section>
                    </section>
                );
            })}
        </Fragment>
    );
};

export default function PayCategories({ modalData }) {
    const ThisCard = <CardList modalData={modalData} />;

    return (
        <section>
            <CarouselCard CardList={ThisCard} size="compact" />
        </section>
    );
}

/*
useEffect(() => {
    // Hide undesired cards in the panel.
    // setTimeout(() => {
    //     const hideTheseCards = document.querySelectorAll("section #carouselCard--root div > section");
    //     if(hideTheseCards.length) {
    //         hideTheseCards.forEach((hiddenCard, ind) => {
    //             if(ind >= 3) {
    //                 hiddenCard.style.display = "none";
    //             }
    //         })
    //     }
    // }, 8000);

}, [])

// SOLVE THIS ISSUE: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
// https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) {
      if (console) {
        console.log('Cannot remove a child from a different parent');
        // console.error('Cannot remove a child from a different parent', child, this);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  }

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  }
}
 */
