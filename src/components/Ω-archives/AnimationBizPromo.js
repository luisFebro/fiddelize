import { useStoreState, useStoreDispatch } from "easy-peasy";
import styled from "styled-components";
import { showModalDefault } from "../redux/actions/modalActions.js";
// End Redux
import ModalDefault from "./modals/ModalDefault.js";
import { ButtonContainerPressedEffectYellow as BtnYellow } from "./buttons/Default";

export default function AnimationBizPromo() {
    // const [isClosed, setIsClosed] = useState(false);

    const {
        isAuthenticated,
        name,
        gotCoupons,
        isFirstBuyCouponOn,
    } = useStoreState((state) => ({
        isAuthenticated: state.authReducer.cases.isUserAuthenticated,
        name: state.userReducer.cases.currentUser.name,
        gotCoupons: state.userReducer.cases.gotCoupons,
        isFirstBuyCouponOn: state.adminReducer.cases.isFirstBuyCouponOn,
    }));
    const dispatch = useStoreDispatch();
    const closeBtn = () => {
        const mainSection = document.getElementById("main-section");
        const closeBtn = document.getElementById("closeBtn");

        closeBtn.className = "fas fa-times-circle animated rotateOut";
        mainSection.classList.add("animated", "slideOutRight", "slow");
        mainSection.style.animationDelay = "0s";
    };

    return (
        <div style={{ zIndex: 1490 }}>
            <ModalDefault
                propTitle={`Parabéns, ${name}!`}
                propMsg="Você ganhou um coupon de desconto de 10% na sua primeira conta"
                propTxtBtn="aplicar desconto"
                objToSend={{
                    couponList: { type: "10% desconto qualquer produto" },
                }}
                closeAnimation={closeBtn}
            />
            {isAuthenticated ? (
                // Pass if admin allow, the modal is not closed and the user does not have a coupon
                isFirstBuyCouponOn && !gotCoupons ? ( // && !isClosed
                    <section
                        id="main-section"
                        className="animated slideInRight slower"
                        style={{
                            animationDelay: "10s",
                            position: "fixed",
                            bottom: "12px",
                            right: "25px",
                            zIndex: 1490,
                        }}
                    >
                        <ImageWrapper
                            // style={{ cursor: 'pointer', height: '370px', maxWidth: '100%' }}
                            src="gif/girl-turning.gif"
                            alt="girl turning"
                            onClick={() => showModalDefault(dispatch)}
                        />
                        <div>
                            <BtnYellow
                                onClick={() => showModalDefault(dispatch)}
                            >
                                <p className="text-normal">
                                    Hey {name}!<br />
                                    Você ganhou desconto. Veja!
                                </p>
                            </BtnYellow>
                            <SpanWrapper>
                                <i
                                    id="closeBtn"
                                    className="fas fa-times-circle animated rotateIn delay-2s"
                                    onClick={() => {
                                        closeBtn();
                                    }}
                                />
                            </SpanWrapper>
                        </div>
                    </section>
                ) : null
            ) : null}
        </div>
    );
}

const ImageWrapper = styled.img`
    cursor: pointer;
    height: 320px;
    maxwidth: 100%;

    /*MOBILE FIRST RESPONSIVE MEDIA QUERIES*/
    /*media portrait tablets and large phones || for large devices, use min-width: 992px and up*/
    @media only screen and (min-width: 600px) {
        height: 370px;
    }
`;

const SpanWrapper = styled.span`
    position: fixed;
    cursor: pointer;
    font-size: 1.9em;
    bottom: 5rem;
    right: 5%;
    color: var(--mainWhite);
    filter: drop-shadow(0.001em 0.1em 0.1em var(--mainDark));
`;
