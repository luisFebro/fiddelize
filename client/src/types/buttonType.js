/*
Reference:
array,
number,
string,
bool,
func,
object,
arrayOf,
node, // n1
symbol,
element,
elementType, // n2
shape,
oneOf,
oneOfType,
 */

import {
    number,
    string,
    shape,
    element,
    func,
    bool,
    oneOf,
} from 'prop-types';

export const buttonMultiType = {
    title: string,
    size: oneOf(["small", "medium", "large"]),
    children: string,
    onClick: func,
    component: string,
    iconFontAwesome: string,
    variant: oneOf(['link', 'contained', 'outlined']),
    color: string,
    backgroundColor: string,
    backColorOnHover: string,
    textTransform: oneOf(['uppercase', 'lowercase', 'capitalize']),
    disabled: bool,
    shadowColor: string,
}


export const buttonFabType = {
    title: string,
    icon: element,
    variant: oneOf(["extended", "round"]),
    size: oneOf(["small", "medium", "large"]),
    position: oneOf(["fixed", "absolute", "relative"]),
    top: number,
    left: number,
    color: string,
    fontSize: string,
    fontWeight: string,
    backgroundColor: string,
    iconFontAwesome: string,
    iconMarginLeft: string,
    iconFontSize: string,
    iconAfterClick: string,
    actionAfterClick: shape({
        setStatus: func,
        status: bool,
    }),
    onClick: func,
}



/* COMMENTS
n1: Anything that can be rendered: numbers, strings, elements or an array
 (or fragment) containing these types.
n2: element for native React components, elementType for your own components (MyComponent)
*/