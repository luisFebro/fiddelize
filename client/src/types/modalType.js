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
    object,
} from 'prop-types';

export const modalDefaultType = {
    title: string,
    subTitle: string,
    txtBtn: string,
    iconBtn: string,
    userId: string,
    modalData: object,
}

export const modalTextFieldDashboardType = shape({
    mainSubject: string,
    title: string,
    subTitle: string,
    txtBtn: string,
    iconBtn: string,
    modalData: object,
    labelTxtField: string,
    userCurrentScore: number,
    userId: string,
})



/* COMMENTS
n1: Anything that can be rendered: numbers, strings, elements or an array
 (or fragment) containing these types.
n2: element for native React components, elementType for your own components (MyComponent)
*/