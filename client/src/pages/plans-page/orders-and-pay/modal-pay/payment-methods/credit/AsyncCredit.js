import React, { useState, useEffect, Fragment } from "react";
import Card from "@material-ui/core/Card";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import TextField from "@material-ui/core/TextField";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import getFirstName from "../../../../../../utils/string/getFirstName";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import usePayMethods from "../helpers/usePayMethods";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import { getBrand } from "./helpers/creditcardMethods";
import FlipCreditCard from "../../../../../../components/cards/flip-credit-card/FlipCreditCard";
// import animateCSS from '../../../../utils/animateCSS';
// import scrollIntoView from '../../../../utils/document/scrollIntoView';

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    card: {
        margin: "auto",
        width: "95%",
        maxWidth: isSmall ? "" : 450,
    },
    fieldForm: {
        backgroundColor: "#fff",
        color: "var(--themeP)",
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "var(--mainFont)",
    },
});

export default function AsyncCredit({ modalData }) {
    const [copy, setCopy] = useState(false);
    const [data, setData] = useState({
        cardNumber: "",
        cardName: "",
        cvvSize: "",
    });
    const { cardNumber, cardName, cvvSize } = data;

    const {
        responseData,
        processing,
        handleSelected,
        setPayMethods,
        authToken,
        getSenderHash,
        itemDescription,
        itemAmount,
        adminName,
        PagSeguro,
    } = modalData;

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    const options = {
        PagSeguro,
        handleSelected,
        getSenderHash,
        authToken,
    };
    const cardsAvailable = usePayMethods("CREDIT_CARD", itemAmount, options);
    useEffect(() => {
        const go = async () => {
            const cardData = await getBrand(cardNumber, { PagSeguro });
            if (cardData) {
                const { name, cvvSize } = cardData;
                setData((prev) => ({
                    ...prev,
                    cardName: name,
                    cvvSize,
                }));
            }
        };

        const needRun = !cardNumber || (cardNumber && cardNumber.length >= 6);
        needRun && go();
    }, [cardNumber]);

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showCTA = () => (
        <section className="my-4 d-flex justify-content-around">
            <ButtonFab
                size="medium"
                title="Ver Doc."
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showMsgProcessing = () => (
        <section
            id="PayContent--boleto-msg"
            className="container-center-col mx-3 full-height my-4 text-subtitle font-weight-bold text-purple text-left"
        >
            Some loading Msg
        </section>
    );

    const showCreditCard = () => (
        <section className="container-center">I am the CREDITCARD</section>
    );

    const showAvailableCards = () => (
        <section className="my-5">
            {!cardsAvailable ? (
                <p className="text-normal text-purple">Carregando cartões...</p>
            ) : (
                <p className="text-normal text-purple font-weight-bold">
                    Cartões disponíveis:
                </p>
            )}
            <section className="container-center">
                {cardsAvailable &&
                    cardsAvailable.map((card) => (
                        <section key={card.name}>
                            <img
                                width={68}
                                height={30}
                                src={card.image}
                                alt={card.name}
                            />
                        </section>
                    ))}
            </section>
        </section>
    );

    const showCard = () => <FlipCreditCard />;

    const showCardNumber = () => (
        <Fragment>
            <p className="text-p text-normal m-0">Insira N.º cartão:</p>
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={false}
                name="cardNumber"
                value={cardNumber}
                variant="outlined"
                autoOk={false}
                onKeyPress={null}
                onBlur={null}
                type="tel"
                autoComplete="off"
                fullWidth
                InputProps={{
                    style: styles.fieldForm,
                    id: "value2",
                }}
            />
            <p className="text-center text-normal">{cardName}</p>
            <p className="text-center text-normal">{cvvSize}</p>
        </Fragment>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            {showCard()}
            {showCardNumber()}
            {showAvailableCards()}
            <ShowPayWatermarks needAnima={false} />
        </section>
    );
}
