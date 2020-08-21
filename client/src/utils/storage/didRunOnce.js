// useful to handle run once an action
// uniqueKey naming should be: componentName_uniqueDescription_id.
import { setVar, removeVar, getVar } from '../../hooks/storage/useVar';

// returns a promise
export default function didRunOnce(uniqueKey, options = {}) {
    const { needRemove } = options;

    return getVar(uniqueKey)
    .then(res => {
        if(!res) {
            setVar({ [uniqueKey]: true })
            return false;
        } else {
            return true;
        }
    })
}