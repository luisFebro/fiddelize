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
    bool,
    object,
    arrayOf,
    shape,
    oneOfType,
} from "prop-types";

export const productType = shape({
    _id: string,
    category: oneOfType([string, object]),
    title: string,
    mainDescription: string,
    price: number,
    link: string,
    quantity: number,
    sold: number,
    inCart: bool,
    info: oneOfType([string, object]),
});

export const productInfoType = shape({
    colors: shape({
        main: string,
        moreOptions: arrayOf(string),
    }),
    company: string,
    howToUse: string,
    refCode: string,
    sizeOrDimmension: number,
    unitsPerPackage: number,
});

/* COMMENTS
n1: Anything that can be rendered: numbers, strings, elements or an array
 (or fragment) containing these types.
n2: element for native React components, elementType for your own components (MyComponent)
*/
