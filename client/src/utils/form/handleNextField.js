import { handleFocus } from './handleFocus';
import isKeyPressed from '../event/isKeyPressed';

// all  inputs should have these following featuers.
// you should have an id to the element wrapper like field1 and in the target input field another id like value1
const passedFields = [];
export const handleNextField = (e, currField, options = {}) => {
    const { event = "onKeyPress", ignoreValue = false } = options;

    const currValue = e && e.target && e.target.value.length;
    if(!currValue && !ignoreValue) return;

    const addFieldToQueue = (isNew = false) => {
         const isNewFieldToArray = passedFields.indexOf(currField) === -1;
         if(isNew) return isNewFieldToArray;

         if(isNewFieldToArray) {
            passedFields.push(currField);
            return true;
        } else { return null; }
    }

    const runNextField = () => {
        const fieldNum = currField.split("").pop();
        const nextField = `field${Number(fieldNum) + 1}`;
        const nextValueField = `value${Number(fieldNum) + 1}`

        const elemToDisplay = document.getElementById(nextField);

        elemToDisplay.classList.add("d-block");
        handleFocus(nextValueField, { delay: 1000 });
    }

    if(event === "onKeyPress") {
        if(isKeyPressed(e, "Enter")) {
           const needRun = addFieldToQueue();
           if(needRun) runNextField();
        }
    } else {
        const needRun = addFieldToQueue(true);
        if(needRun) runNextField();
    }
}