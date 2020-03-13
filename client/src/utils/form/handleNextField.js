import { handleFocus } from './handleFocus';
import isKeyPressed from '../event/isKeyPressed';
import setValObjWithStr from '../objects/setValObjWithStr';

// each from should have if with number like field2, etx...

const validateDataFromObj = prop => {
    if(![prop].obj) throw new Error("setNestedData.obj should be declared");
    if(![prop].key) throw new Error("setNestedData.key should be declared");
    if(![prop].value) throw new Error("setNestedData.value should be declared");
}

export const handleNextField = (type, setShowThisField, options = {}) => e => {
    const { nextField, delay, setNestedData, setData } = options;

    if(!(["onBlur", "onKeyPress"].includes(type))) throw new Error("The type should be either onBlur or onKeyPress");
    if(!nextField) throw new Error("You must to include nextField option")
    if(setNestedData) { validateDataFromObj(setNestedData); }
    if(setData) { validateDataFromObj(setData); }

    const showFieldFunc = () => setShowThisField(nextField, delay);
    const focusFunc = () => handleFocus(nextField);

    if(type === "onKeyPress") {
        if(isKeyPressed(e, "Enter")) {
            showFieldFunc();
            focusFunc();
            if(setNestedData) {
                setValObjWithStr(setNestedData.obj, setNestedData.prop, setNestedData.key);
            }
            if(setData) {
                //setData.func(...setData.obj, [setData.prop]: setData.key);
            }
        }
    }

    if(type === "onBlur") {
        showFieldFunc();
        focusFunc();
    }
}