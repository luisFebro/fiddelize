import PropTypes from "prop-types";
import Toastify from "./toastify.js";
import "./toastify.css";
import { CLIENT_URL } from "../../../config/clientUrl";

ReactToastify.propTypes = {
    text: PropTypes.string,
    duration: PropTypes.number,
    backgroundColor: PropTypes.string,
    isOpen: PropTypes.bool,
};
export default function ReactToastify({
    text,
    duration,
    backgroundColor,
    isOpen,
}) {
    // NOT WORKING
    // const showToastify = (isOpen = true) => (
    //     isOpen &&
    //     Toastify({
    //       text: text || "Hello I am the toastify notifier...",
    //       duration: duration || 4000,
    //       className: "toastify",
    //       fontWeight: 'bold',
    //       avatar: `${CLIENT_URL}/icons/android-chrome-256x256.png`,
    //       close: true,
    //       gravity: "bottom",
    //       position: 'left',
    //       backgroundColor: backgroundColor || "#34495e", // dark blue
    //       stopOnFocus: true, // Prevents dismissing of toast on hover
    //       onClick: function(){} // Callback after click
    //     }).showToastify();
    // );

    return (
        <div>
            {Toastify({
                text: text || "Hello I am the toastify notifier...",
                duration: duration || 4000,
                className: "toastify",
                fontWeight: "bold",
                avatar: `${CLIENT_URL}/icons/android-chrome-256x256.png`,
                close: true,
                gravity: "bottom",
                position: "left",
                backgroundColor: backgroundColor || "#34495e", // dark blue
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick() {}, // Callback after click
            }).showToastify()}
        </div>
    );
}
