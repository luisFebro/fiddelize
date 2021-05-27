import { useState } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SpeedDialButton from "../../components/buttons/SpeedDialButton";
import useData, { useBizData } from "init";
// SpeedDial and Icons
import ModalFullContent from "../../components/modals/ModalFullContent";
import { Load } from "../../components/code-splitting/LoadableComp";

const AsyncNewScoreModal = Load({
    loader: () =>
        import(
            "../app/team/add-points/content/FieldsHandler" /* webpackChunkName: "add-points-full-page-lazy" */
        ),
});

const AsyncNewCustomerModal = Load({
    loading: true,
    loader: () =>
        import(
            "../app/team/registers-panel/RegistersPanel" /* webpackChunkName: "new-customer-full-page-lazy" */
        ),
});

const AsyncPromoteModal = Load({
    loading: true,
    loader: () =>
        import(
            "./QuickPromote" /* webpackChunkName: "promote-full-page-lazy" */
        ),
});

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.1)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
    fabRoot: {
        bottom: "75px",
        right: "85px",
    },
});

function MoreOptionsBtn({
    history,
    playBeep,
    showMoreBtn,
    colorS,
    // animaClass,
}) {
    const [newScoreOpen, setNewScore] = useState(false);
    const [newCustomerOpen, setNewCustomer] = useState(false);
    const [promoteOpen, setPromote] = useState(false);

    const styles = getStyles();

    const { userId } = useData();
    const { themeBackColor: backColor } = useBizData();

    const speedDial = {
        actions: [
            // the order rendered is inverse from the bottom to top
            {
                icon: (
                    <FontAwesomeIcon
                        icon="bullhorn"
                        style={{ ...styles.muStyle, transform: "scale(1.3)" }}
                    />
                ),
                name: "Divulgar ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    setPromote(true);
                },
            },
            {
                icon: (
                    <GroupWorkIcon
                        style={{
                            ...styles.muStyle,
                            transform: "rotate(40deg)",
                        }}
                    />
                ),
                name: "Cadastrar Pontos ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    setNewScore(true);
                    // playBeep();
                },
            },
            {
                icon: <PersonAddIcon style={styles.muStyle} />,
                name: "Cadastrar Cliente ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    setNewCustomer(true);
                    // playBeep();
                },
            },
        ],
    };

    const showNewScoreComp = () => {
        const handleScoreClose = () => {
            setNewScore(false);
        };

        const Comp = <AsyncNewScoreModal closeModal={handleScoreClose} />;

        return (
            <ModalFullContent
                contentComp={Comp}
                fullOpen={newScoreOpen}
                needIndex={false}
                setFullOpen={setNewScore}
                backgroundColor={`var(--themeBackground--${backColor})`}
            />
        );
    };

    const showNewCustomerComp = () => {
        const Comp = <AsyncNewCustomerModal isNewMember={false} />;

        return (
            <ModalFullContent
                contentComp={Comp}
                fullOpen={newCustomerOpen}
                setFullOpen={setNewCustomer}
                needIndex={false}
            />
        );
    };

    const showNewPromoteComp = () => {
        const handlePromoteClose = () => {
            setPromote(false);
        };

        const Comp = <AsyncPromoteModal handleFullClose={handlePromoteClose} />;

        return (
            <ModalFullContent
                contentComp={Comp}
                fullOpen={promoteOpen}
                setFullOpen={setPromote}
                needIndex={false}
                backgroundColor={`var(--themeBackground--${backColor})`}
            />
        );
    };

    const [openStatus, setOpenStatus] = useState(false);
    return (
        <div className="position-relative">
            {openStatus && (
                <div
                    className="position-absolute animated fadeInUp"
                    style={{
                        zIndex: 1,
                        backgroundColor: `var(--themeSDark--${colorS})`,
                        padding: "0px 50px 0px 15px",
                        float: "right",
                        right: 40,
                        bottom: 35,
                    }}
                >
                    <h2
                        className="text-subtitle text-white"
                        style={{ zIndex: 2000 }}
                    >
                        Ações Rápidas
                    </h2>
                </div>
            )}
            <SpeedDialButton
                handleOpenStatus={setOpenStatus}
                mainIcon={
                    <FontAwesomeIcon icon="bolt" style={{ fontSize: "25px" }} />
                }
                actions={speedDial.actions}
                onClick={playBeep}
                tooltipOpen
                backColor={`var(--themeSDark--${colorS})`}
                size="large"
                FabProps={{
                    backgroundColor: `var(--themeSDark--${colorS})`,
                    size: "medium",
                    filter: "drop-shadow(.5px .5px 3px black)", // still not working
                }}
                root={{
                    bottom: "15px",
                    right: "15px",
                }}
                hidden={!showMoreBtn}
            />
            {newScoreOpen && showNewScoreComp()}
            {newCustomerOpen && showNewCustomerComp()}
            {promoteOpen && showNewPromoteComp()}
        </div>
    );
}

export default withRouter(MoreOptionsBtn);
