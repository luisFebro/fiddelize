// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

// When the last component is out, then it is necessary that the first one to become true again.
export const showComponent = (dispatch, currentComp) =>
    dispatch({ type: "COMPONENT_DISPLAYED", payload: currentComp });

export const showComponentSet2 = (dispatch, currentComp) =>
    dispatch({ type: "COMPONENT_SET2_DISPLAYED", payload: currentComp });
