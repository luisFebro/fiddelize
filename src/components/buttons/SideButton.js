import React from 'react';
import styled from 'styled-components';

// need to set flexBasis to the mainContent in order to sum up to 100% in total.
export default function SideButton({
    onClick,
    fontAwesomeIcon,
    flexBasis,
    height,
    backgroundColor }) {
    const styles = {
        btn: {
            flexBasis: flexBasis || "10%",
            height: height || 'auto',
            backgroundColor:  backgroundColor || 'var(--lightGrey)',
        }
    }
    return (
        <BtnWrapper
            style={styles.btn}
            onClick={onClick}
            onMouseOver={e => e.target.style.backgroundColor = 'grey'}
            onMouseOut={e => e.target.style.backgroundColor = 'var(--lightGrey)'}
        >
            <i className={`${fontAwesomeIcon || "fas fa-angle-right"}`}></i>
        </BtnWrapper>
    );
}

const BtnWrapper = styled.button`
    display: flex;
    justify-content: center;
    border: none;
    outline: none;

    & i {
        font-size: 5em;
        color: white;
        filter: drop-shadow(.001em .001em .15em var(--mainDark));
    }
`;