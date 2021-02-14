import { Fragment, useEffect } from "react";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import DashSectionTitle from "../../DashSectionTitle";
import StaffWithBookingsList from "./StaffWithBookingsList";
import DrawerBtn from "./drawer/DrawerBtn";
import { readServicesList } from "../../../redux/actions/adminActions";

export default function DashBooking() {
    const { services } = useStoreState((state) => ({
        services: state.adminReducer.cases.services,
    }));
    const dispatch = useStoreDispatch();

    useEffect(() => {
        readServicesList(dispatch);
    }, []);

    const styles = {
        drawerBtn: {
            height: "7rem",
            width: "100%",
            // carbon css pattern
            background:
                "linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px, linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px, linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px, linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px, linear-gradient(90deg, #1b1b1b 10px, transparent 10px), linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424)",
            backgroundColor: "#131313",
            backgroundSize: "20px 20px",
            // end carbon css pattern
            zIndex: 1000,
        },
    };

    const showHandleServicesBtn = () => (
        <div style={styles.drawerBtn} className="container-center">
            <DrawerBtn
                drawer={{
                    title: "Ajustar Serviços Oferecidos",
                    drawerData: services,
                }}
                button={{
                    title: "Ajustar Serviços",
                    iconFontAwesome: "fas fa-cogs",
                    backgroundColor: "var(--mainPink)",
                    backColorOnHover: "var(--mainPink)",
                }}
            />
        </div>
    );

    return (
        <Fragment>
            <DashSectionTitle title="Todos Agendamentos dos Colaboradores" />
            {showHandleServicesBtn()}
            <StaffWithBookingsList />
        </Fragment>
    );
}
