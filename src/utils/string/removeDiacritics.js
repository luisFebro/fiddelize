const removeDiacritics = string => {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // n1
}

module.exports = removeDiacritics;
/* COMMENTS
n1:
diacritics: ÄÅÁÂÀÃäáâàãÉÊËÈéêëèÍÎÏÌíîïìÖÓÔÒÕöóôòõÜÚÛüúûùÇç
Two things are happening here:
normalize()ing to NFD Unicode normal form decomposes combined graphemes into the combination of simple ones. The è of Crème ends up expressed as e + ̀.
Using a regex character class to match the U+0300 → U+036F range, it is now trivial to globally get rid of the diacritics, which the Unicode standard conveniently groups as the Combining Diacritical Marks Unicode block.
ref: https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
*/
