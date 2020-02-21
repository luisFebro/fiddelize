const isPalindrome = string => {
    // Validation
    if(string.length === 0) return true;
    if(!string) return console.log("oops! wrong string format");
    if(typeof string !== "string") {
        string = string.toString();
    }
    if(string.length <= 1) return console.log("oops! Type a value which length it is at least 2 characters!")
    string = string.toLowerCase().replace(/\W/g, ''); // remove non-word characters;
    // End Validation

    let isPalindrome;
    let reverse = "";

    let letter;
    let counter = 1;
    for(letter of string) {
        reverse += string.charAt(string.length - counter++) // n1
    }

    isPalindrome = reverse === string;

    return isPalindrome;
}


/* COMMENTS
n1: alt: normalizedString === normalizedString.split('').reverse().join('');
*/
console.log(isPalindrome("sas"))