// copy this to every component which needs icons:
// USE: import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; <FontAwesomeIcon icon="heart" />
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faHeart,
    faStar,
    faFlagCheckered,
    faExclamationCircle, // for errors
    faInfo, // for warning
    faCheckCircle, // for success
    faPaperPlane, // for send data
    faLock, // for authentication
    faSave,
    faKeyboard,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHeart,
  faStar,
  faFlagCheckered,
  faExclamationCircle,
  faInfo,
  faCheckCircle,
  faPaperPlane,
  faLock,
  faSave,
  faKeyboard,
);