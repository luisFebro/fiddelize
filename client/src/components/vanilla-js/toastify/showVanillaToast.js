import Toastify from './toastify';
import './toastify.css';
import { CLIENT_URL } from '../../../config/clientUrl';


export default function showVanillaToast(
    title,
    duration,
    options = {
        close: null, // L
        backgroundColor: null,
        gravity: null,
        needActionBtn: false,
        actionBtnText: null,
        avatar: null,
        onClick: null,
    }) {

    Toastify({
      text: title || "I am the the toast message",
      duration: duration || 5000,
      className: "toastify",
      fontWeight: 'bolder',
      positionLeft: true,
      avatar: !options.avatar ? `` : options.avatar.includes(".") ? options.avatar : "", // ${CLIENT_URL}/icons/android-chrome-256x256.png
      close: !options.close ? true : false,
      gravity: options.gravity || "bottom",
      position: options.position || 'left',
      backgroundColor: options.backgroundColor || "#34495e", // dark blue,
      stopOnFocus: true, // Prevents dismissing of toast on hover
      onClick: options.onClick || function(){}, // Callback after click
      needActionBtn: options.needActionBtn,
      actionBtnText: options.actionBtnText,
    }).showToast();
}

// LESSON: It got no effect on assigning default values to an object parameter in a funciton.
// It returns undefined... you can set null to every key or give an pattern value...