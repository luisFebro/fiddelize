// remove dashes and capitalize string for usage in breadscrumbs for instance.
export default function removeDashes(string) {
    return string.split("-").join(" ").cap();
}

// e.g
// console.log(removeDashes("a-b-c"))
// A B C
