import styled from "styled-components";

export const ButtonContainerNoFillLightBlue = styled.button`
    :root {
        --mainBlue: #2a2a72;
        --mainYellow: #ffa400;
        --lightBlue: #009ffd;
    }

    text-transform: capitalize;
    font-size: 1.4rem;
    background: transparent;
    border: 0.05rem solid var(--lightBlue);
    border-color: ${(props) =>
        props.cart ? "var(--mainYellow)" : "var(--lightBlue)"};
    color: ${(props) =>
        props.cart ? "var(--mainYellow)" : "var(--lightBlue)"};
    border-radius: 0.5rem;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    margin: 0.2rem 0.5rem 0.2rem 0;
    transition: all 0.5s ease-in-out;
    &:hover {
        background: ${(props) =>
            props.cart ? "var(--mainYellow)" : "var(--lightBlue)"};
        color: var(--mainBlue);
    }
    &:focus {
        outline: none; /*takes the line created out*/
    }
`;

// Pressed Effect - Collection
export const ButtonContainerPressedEffectYellow = styled.button`
    outline: none;

    padding: .5rem .9rem;
    margin: .2rem .5rem .2rem 0;

    border: none;
    border-radius: 15px;
    background-color: var(--mainYellow);
    box-shadow: 0 5px #999;
    outline: none;
    color: #fff;

    text-align: center;
    text-decoration: none;
    font-size: 1.4rem;

    cursor: pointer;
}

    &:hover {
        background-color: #f9a800;
    }

    &:active {
        background-color: #f9a800;
        box-shadow: 0 1px #666;

        transform: translateY(4.5px);
    }

    &:focus {
        outline: none;
    }
`;

export const ButtonContainerPressedEffectDark = styled(
    ButtonContainerPressedEffectYellow
)`
    background-color: black;
    &:hover {
        background-color: var(--mainDark);
    }

    &:active {
        background-color: var(--mainDark);
    }
`;

// End Pressed Effect - Collection
