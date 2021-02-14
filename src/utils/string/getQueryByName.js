// reference: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export default function getQueryByName(name, searchQuery) {
    if (!searchQuery) searchQuery = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(searchQuery);
    if (!results) return null; // n1
    if (!results[2]) return "";

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* COMMENTS
n1:result variable output exemple:
[ '?name=Luis%20Fdsfd',
  '=Luis%20Fdsfd',
  'Luis%20Fdsfd',
  index: 0,
  input: '?name=Luis%20Fdsfd&phone=(99)%2099281-7363&bizName=You%20Vipp%20Shop',
  groups: undefined ]
*/

// console.log(getQueryByName("name", "?name=Luis%20Fdsfd&phone=(99)%2099281-7363&bizName=You%20Vipp%20Shop"))
