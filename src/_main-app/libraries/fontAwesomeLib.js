// copy this to every component which needs icons:
// USE: import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; <FontAwesomeIcon icon="heart" />
// Warning: this destructing by line is due to tree-shaking and avoid to import the entire fas icons and thus a bloated bundle.
// const fasPath = "@fortawesome/free-solid-svg-icons"; // Not possible for now to declare a variable and use it as >> ... from `${fasPath}/faCheck`...
import { library } from "@fortawesome/fontawesome-svg-core";
// ICONS n1
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons/faAngleDoubleRight"; // generate something
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt"; // generate something
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight"; // continue
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"; // Confirmation btn
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle"; // for success
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faCogs } from "@fortawesome/free-solid-svg-icons/faCogs"; // tech support, setting
import { faComment } from "@fortawesome/free-solid-svg-icons/faComment";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase"; // security copies
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle"; // for errors
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons/faFlagCheckered";
import { faGem } from "@fortawesome/free-solid-svg-icons/faGem"; // milestone icons and reward config
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle"; // for warning
import { faKeyboard } from "@fortawesome/free-solid-svg-icons/faKeyboard";
import { faListOl } from "@fortawesome/free-solid-svg-icons/faListOl"; // CPF keypad // history
import { faListUl } from "@fortawesome/free-solid-svg-icons/faListUl"; // score regulation
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"; // for authentication, password
import { faLongArrowAltDown } from "@fortawesome/free-solid-svg-icons/faLongArrowAltDown";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons/faMinusCircle"; // discount btn
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons/faMobileAlt";
import { faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons/faMoneyBillAlt"; // Purchase Value keypad
import { faPalette } from "@fortawesome/free-solid-svg-icons/faPalette"; // for send data
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane"; // for send data
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle"; // instruction btn
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply"; // back, return
import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons/faShareAlt";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons/faSyncAlt"; // change something, update
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes"; // keypad cancel btn
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle"; // closing btn
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt"; // delete btn
import { faTrophy } from "@fortawesome/free-solid-svg-icons/faTrophy";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faHandHolding } from "@fortawesome/free-solid-svg-icons/faHandHolding";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faHistory } from "@fortawesome/free-solid-svg-icons/faHistory";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons/faArrowCircleDown";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowCircleUp";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { faSms } from "@fortawesome/free-solid-svg-icons/faSms";
import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons/faSortAmountDown";
import { faSortAmountDownAlt } from "@fortawesome/free-solid-svg-icons/faSortAmountDownAlt";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons/faMapMarkedAlt";
// services
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { faMagic } from "@fortawesome/free-solid-svg-icons/faMagic";
// app milestone icons
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons/faAppleAlt";
import { faCar } from "@fortawesome/free-solid-svg-icons/faCar";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons/faCartPlus";
import { faCocktail } from "@fortawesome/free-solid-svg-icons/faCocktail";
import { faCut } from "@fortawesome/free-solid-svg-icons/faCut";
import { faDragon } from "@fortawesome/free-solid-svg-icons/faDragon";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons/faDumbbell";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faFire } from "@fortawesome/free-solid-svg-icons/faFire";
import { faGamepad } from "@fortawesome/free-solid-svg-icons/faGamepad";
import { faGrinHearts } from "@fortawesome/free-solid-svg-icons/faGrinHearts";
import { faHamburger } from "@fortawesome/free-solid-svg-icons/faHamburger";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faIceCream } from "@fortawesome/free-solid-svg-icons/faIceCream";
import { faMedal } from "@fortawesome/free-solid-svg-icons/faMedal";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { faPaw } from "@fortawesome/free-solid-svg-icons/faPaw";
import { faRobot } from "@fortawesome/free-solid-svg-icons/faRobot";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faStarHalf } from "@fortawesome/free-solid-svg-icons/faStarHalf";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons/faStethoscope";
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun";
import { faTshirt } from "@fortawesome/free-solid-svg-icons/faTshirt";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons/faHeartBroken";
// end app milestone icons
// home marketing
import { faBullhorn } from "@fortawesome/free-solid-svg-icons/faBullhorn";
import { faStore } from "@fortawesome/free-solid-svg-icons/faStore";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";
import { faPhoneSquareAlt } from "@fortawesome/free-solid-svg-icons/faPhoneSquareAlt";
// rating nps
import { faAngry } from "@fortawesome/free-solid-svg-icons/faAngry";
import { faFrown } from "@fortawesome/free-solid-svg-icons/faFrown";
import { faMeh } from "@fortawesome/free-solid-svg-icons/faMeh";
import { faGrimace } from "@fortawesome/free-solid-svg-icons/faGrimace";
import { faGrinAlt } from "@fortawesome/free-solid-svg-icons/faGrinAlt";

library.add(
    faAngleDoubleRight,
    faAngleRight,
    faArrowLeft,
    faArrowRight,
    faChartPie,
    faCheck,
    faCheckCircle,
    faCircle,
    faClock,
    faCogs,
    faComment,
    faCrown,
    faDatabase,
    faExclamationCircle,
    faFileAlt,
    faFlagCheckered,
    faGem,
    faHome,
    faImage,
    faInfoCircle,
    faKeyboard,
    faListOl,
    faListUl,
    faLock,
    faLongArrowAltDown,
    faMinus,
    faMinusCircle,
    faMobileAlt,
    faMoneyBillAlt,
    faPalette,
    faPaperPlane,
    faPlus,
    faQuestion,
    faQuestionCircle,
    faSave,
    faShareAlt,
    faShoppingCart,
    faSyncAlt,
    faTimes,
    faTimesCircle,
    faTrashAlt,
    faTrophy,
    faUser,
    faHandHolding,
    faThumbsUp,
    faSearch,
    faHistory,
    faArrowCircleDown,
    faArrowCircleUp,
    faArrowUp,
    faArrowDown,
    faSms,
    faSortAmountDown,
    faSortAmountDownAlt,
    faMapMarkedAlt,
    faBell,
    // home marketing
    faBullhorn,
    faStore,
    faCreditCard,
    faPhoneSquareAlt,
    // services
    faFilter,
    faMagic,
    // app milestone icons
    faAppleAlt,
    faCar,
    faCartPlus,
    faCocktail,
    faCut,
    faDragon,
    faDumbbell,
    faFire,
    faGamepad,
    faGrinHearts,
    faHamburger,
    faHeart,
    faIceCream,
    faMedal,
    faMusic,
    faPaw,
    faRobot,
    faStar,
    faStarHalf,
    faStethoscope,
    faSun,
    faTshirt,
    faUserTie,
    faReply,
    faBolt,
    faHeartBroken,
    // rating NPS
    faAngry,
    faFrown,
    faMeh,
    faGrimace,
    faGrinAlt
);

export const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "white",
};

/* COMMENTS
n1: solution with named destructing
 We weren't able to get tree shaking to work out of the box with Webpack 4. Thankfully, we were able to workaround the issue using babel-plugin-transform-imports with a configuration like this:

 // .babelrc
 {
   "plugins": [
     ["transform-imports", {
       "@fortawesome/free-solid-svg-icons": {
         "transform": "@fortawesome/free-solid-svg-icons/${member}",
         "skipDefaultConversion": true
       }
     }]
   ]
 }
 With that, we're still able to import members directly from the package.

 import { faTimes, faEnvelope } from '@fortawesome/free-solid-svg-icons';
 This works for Pro versions as well.
https://github.com/FortAwesome/react-fontawesome/issues/70
*/
