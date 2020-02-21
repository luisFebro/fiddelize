// reference: https://dev.to/nazmifeeroz/using-usecontext-and-usestate-hooks-as-a-store-mnm
// https://milddev.com/react/react-createcontext/
// THIS SHIT IS NOT WORKING AND NOT BEING USED......
// REDUX is used instead,,,
import React, { useState, createContext } from 'react';

export const GroupContext = createContext();

export const GroupProvider = (props) => {
    const [run, setRun] = useState(false);

    return (
        <GroupContext.Provider value={[run, setRun]}>
            {props.children}
        </GroupContext.Provider>
    );
}
