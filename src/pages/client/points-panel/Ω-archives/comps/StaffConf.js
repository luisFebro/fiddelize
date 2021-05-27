// import { useState, Fragment } from "react";
// import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import MoneyIcon from "@material-ui/icons/Money";
// import Card from "@material-ui/core/Card";

// import PropTypes from "prop-types";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Title from "../../../../components/Title";
// import { showComponent } from "../../../../redux/actions/componentActions";
// import { showSnackbar } from "../../../../redux/actions/snackbarActions";
// import ButtonMulti, {
//     faStyle,
// } from "../../../../components/buttons/material-ui/ButtonMulti";
// import handleChange from "../../../../utils/form/use-state/handleChange";
// import { handleEnterPress } from "../../../../utils/event/isKeyPressed";
// import clearForm from "../../../../utils/form/use-state/clearForm";
// import { checkVerificationPass } from "../../../../redux/actions/adminActions";
// import { useBizData } from "init";
// import  from "../../../../utils/biz/";

// StaffConf.propTypes = {
//     success: PropTypes.bool,
//     setVerification: PropTypes.func,
//     valuePaid: PropTypes.string,
// };

// export default function StaffConf({
//     success,
//     setVerification,
//     valuePaid,
//     desc,
// }) {
//     const [data, setData] = useState({
//         pass: "",
//         bizId: "",
//     });

//     const { bizId, themePColor, themeSColor, themeBackColor } = useBizData();

//     const { pass } = data;
//     const [fieldError, setFieldError] = useState(null);
//     const errorCpf = fieldError && fieldError.cpf;

//     const dispatch = useStoreDispatch();

//     const clearData = () => {
//         clearForm(setData, data);
//         setFieldError(null);
//     };

//     const checkAccess = () => {
//         const bodyToSend = {
//             pass,
//             bizId,
//         };
//         checkVerificationPass(dispatch, bodyToSend).then((res) => {
//             if (res.status === 500)
//                 return showSnackbar(
//                     dispatch,
//                     "Algo deu errado. Verifique sua conexão.",
//                     "error"
//                 );
//             if (res.status === 401)
//                 return showSnackbar(dispatch, res.data.msg, "error");
//             // showSnackbar(dispatch, res.data.msg, 'success');
//             setVerification(true);
//             showComponent(dispatch, "clientScoresPanel");
//         });
//     };

//     const showCheckSummary = () => (
//         <div className="d-flex align-content-start ml-3">
//             <p
//                 className={`${(
//                     themeBackColor
//                 )} font-weight-bold text-subtitle`}
//             >
//                 &#187; <strong>Conferir:</strong>
//                 {desc ? (
//                     <Fragment>
//                         <br />
//                         <span className="text-normal text-break">
//                             <strong>• Descrição: </strong>
//                             {!desc ? "Nenhuma" : desc}
//                         </span>
//                     </Fragment>
//                 ) : null}
//                 <br />
//                 <span className="text-normal">
//                     <strong>• Valor da Compra: </strong>
//                     <span className="text-title">R$ {valuePaid}</span>
//                 </span>
//             </p>
//         </div>
//     );

//     const showTitle = () => (
//         <Title
//             title="Insira a senha de verificação"
//             color="var(--mainWhite)"
//             needShadow
//             backgroundColor={`var(--themePDark--${themePColor})`}
//         />
//     );

//     const showForm = () => (
//         <form
//             style={{ margin: "auto", width: "80%", backgroundColor: "white" }}
//             onBlur={() => setFieldError(null)}
//         >
//             <TextField
//                 required
//                 variant="standard"
//                 margin="dense"
//                 onChange={handleChange(setData, data)}
//                 autoComplete="off"
//                 autoFocus
//                 onKeyPress={(e) => handleEnterPress(e, checkAccess)}
//                 error={null}
//                 name="pass"
//                 value={pass}
//                 type="text"
//                 className="dot-font"
//                 fullWidth
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <MoneyIcon />
//                         </InputAdornment>
//                     ),
//                     style: {
//                         backgroundColor: "white",
//                     },
//                 }}
//             />
//         </form>
//     );

//     const showButtonActions = () => (
//         <div className="container-center mt-1 mb-4">
//             <ButtonMulti
//                 title="Verificar"
//                 onClick={checkAccess}
//                 color="var(--mainWhite)"
//                 shadowColor="white"
//                 backgroundColor={`var(--themeSDark--${themeSColor})`}
//                 backColorOnHover={`var(--themeSDark--${themeSColor})`}
//                 iconFontAwesome={
//                     <FontAwesomeIcon icon="check" style={faStyle} />
//                 }
//                 textTransform="uppercase"
//             />
//         </div>
//     );

//     return (
//         <div className="container-center-col mt-4">
//             {showCheckSummary()}
//             <Card
//                 className="animated slideInLeft fast text-normal align-self-center"
//                 style={{
//                     maxWidth: 330,
//                     backgroundColor: `var(--themePDark--${themePColor})`,
//                 }}
//             >
//                 {showTitle()}
//                 {showForm()}
//                 {showButtonActions()}
//             </Card>
//         </div>
//     );
// }
