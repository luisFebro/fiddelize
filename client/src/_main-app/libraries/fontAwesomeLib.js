// copy this to every component which needs icons:
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// use it like <FontAwesomeIcon icon="heart" />
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faHeart,
    faStar,
    faFlagCheckered
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHeart,
  faStar,
  faFlagCheckered,
);