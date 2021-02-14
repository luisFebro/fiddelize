import styled from "styled-components";

// need to set flexBasis to the mainContent in order to sum up to 100% in total.
export default function SideButton({
    onClick,
    fontAwesomeIcon,
    flexBasis,
    height,
    backgroundColor,
}) {
    const styles = {
        btn: {
            flexBasis: flexBasis || "10%",
            height: height || "auto",
            backgroundColor: backgroundColor || "var(--lightGrey)",
        },
    };
    return (
        <BtnWrapper
            style={styles.btn}
            onClick={onClick}
            onMouseOver={(e) => (e.target.style.backgroundColor = "grey")}
            onMouseOut={(e) =>
                (e.target.style.backgroundColor = "var(--lightGrey)")
            }
        >
            <i className={`${fontAwesomeIcon || "fas fa-angle-right"}`} />
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
        filter: drop-shadow(0.001em 0.001em 0.15em var(--mainDark));
    }
`;
