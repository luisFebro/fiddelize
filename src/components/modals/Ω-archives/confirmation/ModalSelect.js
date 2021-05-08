// import { useState } from "react";
// // Redux

// // Material UI
// import { makeStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import MenuItem from "@material-ui/core/MenuItem";
// import Select from "@material-ui/core/Select";
// // import TextField from '@material-ui/core/TextField';
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import PropTypes from "prop-types";
// import handleChange from "../../../utils/form/use-state/handleChange";
// import { showSnackbar } from "../../../redux/actions/snackbarActions";
// import { closeModal } from "../../../redux/actions/modalActions";

// ModalSelect.propTypes = {
//     currItemFound: PropTypes.shape({
//         propTitle: PropTypes.string,
//         propSubTitle: PropTypes.string,
//         propTxtBtn: PropTypes.string,
//         // mainSubject: PropTypes.string,
//         objToSend: PropTypes.object,
//     }),
// };
// // End Material UI

// const useStyles = makeStyles((theme) => ({
//     button: {
//         margin: theme.spacing(1),
//     },
//     media: {
//         height: 50,
//         width: "50%",
//         margin: "auto",
//     },
//     textField: {
//         marginLeft: theme.spacing(1),
//         marginRight: theme.spacing(1),
//     },
// }));

// // DATA
// let arrayUserFunctions;
// let propTitle;
// let propTitleSelect;
// let propTxtBtn;
// let objState;
// const getSelectedInfo = (mainSubject) => {
//     switch (mainSubject) {
//         case "Função Usuário":
//             arrayUserFunctions = ["admin", "colaborador", "cliente"];
//             propTitle = "Nova Função Usuário";
//             propTitleSelect = "Selecione:";
//             propTxtBtn = "Aplicar";
//             objState = { role: "Selecione:" };
//             break;
//         default:
//         // console.log("nothing returned from Switch")
//     }
// };
// // END DATA

// export default function ModalSelect({ currItemFound }) {
//     const mainSubject = currItemFound && currItemFound.mainSubject;
//     const isUserFunction = mainSubject === "Função Usuário";
//     const _idTarget = currItemFound && currItemFound._id;
//     getSelectedInfo(mainSubject);

//     const [data, setData] = useState(objState);

//     const { isModalSelectOpen } = useStoreState((state) => ({
//         isModalSelectOpen: state.modalReducers.cases.isModalSelectOpen,
//     }));
//     const dispatch = useStoreDispatch();

//     const setObjToSend = () => {
//         if (isUserFunction) {
//             if (data && data.role === "")
//                 return showSnackbar(dispatch, "Selecione uma opção", "error");
//             // THIS WAS MOVED TO A SEPARATED COMPONENT
//                 showSnackbar(
//                     dispatch,
//                     "O Tipo de Usuário foi alterado e movido.",
//                     "success"
//                 );
//                 readUserList(dispatch);
//             });
//         }
//     };

//     const classes = useStyles();

//     const showButtonAction = () => (
//         <section>
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     marginTop: "28px",
//                 }}
//             >
//                 <Button
//                     onClick={() => {
//                         closeModal(dispatch);
//                     }}
//                     color="primary"
//                 >
//                     Voltar
//                 </Button>
//                 <Button
//                     onClick={() => {
//                         setObjToSend();
//                         closeModal(dispatch);
//                     }}
//                     variant="contained"
//                     color="primary"
//                     className={classes.button}
//                 >
//                     {propTxtBtn}
//                     <i
//                         className="fas fa-paper-plane"
//                         style={{ marginLeft: "5px" }}
//                     />
//                 </Button>
//             </div>
//         </section>
//     );

//     const showSelect = () => (
//         <form style={{ margin: "auto", width: "90%" }}>
//             <Select
//                 style={{ margin: "9px 0" }}
//                 labelId="role"
//                 onChange={handleChange(setData, data)}
//                 name="role"
//                 value={data && data.role}
//                 fullWidth
//             >
//                 <MenuItem value={data && data.role}>{propTitleSelect}</MenuItem>
//                 {arrayUserFunctions &&
//                     arrayUserFunctions.map((item, ind) => (
//                         <MenuItem key={ind} value={item}>
//                             {item}
//                         </MenuItem>
//                     ))}
//             </Select>
//         </form>
//     );
//     return (
//         <Dialog open={isModalSelectOpen} aria-labelledby="form-dialog-title">
//             <DialogTitle id="form-dialog-title">{propTitle}</DialogTitle>
//             {showSelect()}
//             {showButtonAction()}
//         </Dialog>
//     );
// }
