import { useStoreState, useStoreDispatch } from "easy-peasy";
import { closeModal } from "../../redux/actions/modalActions";
// End Redux
import { underConstruction } from "../../data/dataIllustrations";
import { ButtonContainerPressedEffectDark as DarkBtn } from "../buttons/Default";

export default function UnderConstruction() {
    const isModalUnderConstructionOpen = useStoreState(
        (state) => state.modalReducers.cases.isModalUnderConstructionOpen
    );
    const dispatch = useStoreDispatch();

    return isModalUnderConstructionOpen ? (
        <ModalContainer>
            <div className="container">
                <div className="row">
                    <div
                        id="modal"
                        className="col-10 mx-auto col-md-6 col-lg-4 text-center text-capitalize p-1"
                    >
                        <section>
                            <img
                                className="img-fluid mx-auto my-2 shadow-elevation"
                                src={underConstruction.img}
                                alt={underConstruction.title}
                            />
                            <h2>Em Manutenção.</h2>
                            <h2>Logo ficará disponível! :)</h2>
                        </section>
                        <DarkBtn
                            className="my-4"
                            onClick={() => closeModal(dispatch)}
                        >
                            Entendi.
                        </DarkBtn>
                    </div>
                </div>
            </div>
        </ModalContainer>
    ) : null;
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
    z-index: 1500;
    #modal {
        background: var(--mainWhite);
    }
`;
