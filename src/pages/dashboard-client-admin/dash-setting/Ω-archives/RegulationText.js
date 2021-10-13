// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export default function RegulationText() {
//     const updateRegText = () => {
//         showSnackbar(dispatch, "Atualizando Texto...", "warning", 6000);
//         const objToSend = {
//             regulationText,
//         };
//             if (res.status !== 200)
//                 return showSnackbar(dispatch, res.data.msg, "error");
//             showSnackbar(
//                 dispatch,
//                 "Texto acabou de ser atualizado!",
//                 "success"
//             );
//         });
//     };

//     const showActionBtn = () => (
//         <div className="d-flex justify-content-end mr-2">
//             <Link to="/:bizLinkName/regras">
//                 <ButtonMulti
//                     onClick={updateRegText}
//                     color="var(--mainWhite)"
//                     backgroundColor="var(--mainPink)"
//                     backColorOnHover="var(--mainPink)"
//                     iconFontAwesome={<FontAwesomeIcon icon="file-alt" />}
//                     textTransform="uppercase"
//                 >
//                     Ver Resultado
//                 </ButtonMulti>
//             </Link>
//         </div>
//     );

//     const showTextForm = () => (
//         <div className="container-center text-break text-normal">
//             <TextField
//                 style={{ fontSize: "1.3em" }}
//                 multiline
//                 rows={10}
//                 name="regulationText"
//                 value={regulationText === "" ? "Carregando..." : regulationText}
//                 onChange={handleChange(setData, data)}
//                 onBlur={() => updateRegText()}
//                 variant="outlined"
//                 fullWidth
//                 placeholder="Regras para ponto fidelidade"
//                 margin="dense"
//             />
//         </div>
//     );

//     return (
//         <section className="margin-auto-90">
//             <p className="text-center text-normal font-weight-bold">
//                 Editar Regulamento de Pontos de Fidelidade
//             </p>
//             {showTextForm()}
//             {showActionBtn()}
//         </section>
//     );
// }
