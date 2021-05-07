// export default function KeyAccessDashboard() {
//     const { isUserAuthenticated, role } = useStoreState((state) => ({
//         isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
//         role: state.userReducer.cases.currentUser.role,
//     }));

//     return (
//         <div>
//             {isUserAuthenticated ? (
//                 role === "admin" ? (
//                     <span
//                         className="p-2 badge badge-primary shadow-elevation"
//                         style={{
//                             position: "absolute",
//                             right: "0",
//                             top: "0",
//                             zIndex: 1500,
//                         }}
//                     >
//                         <i
//                             style={{ fontSize: "1.3rem" }}
//                             className="fas fa-key"
//                             onClick={null}
//                         >
//                             <span
//                                 className="text-border-black pl-3"
//                                 style={{ whiteSpace: "nowrap" }}
//                             >
//                                 Modo Admin
//                             </span>
//                         </i>
//                     </span>
//                 ) : null
//             ) : null}
//         </div>
//     );
// }
