import removeDashes from "./string/removeDashes";

/**
 * get an obj with subdir's names and links to navigate
 * @param  {string} currentPath
 * @return {object}
 */
export default function getBreadCrumbData(currentPath) {
    if (currentPath === "/") return [];
    const arraySubdirects = currentPath.split("/");

    // const rootDomain = "http://youvippshop.com"; // this is not necessary.explanation: www = subdomain / youvippshop = domain name /.com = Top-Level Domain
    const mainFileName = arraySubdirects[arraySubdirects.length - 1];

    let accumulatedUrls = "";
    const arrayUrls = arraySubdirects.map((subdir, ind) => {
        if (mainFileName === subdir) return "";
        ind === 1 // n1
            ? (accumulatedUrls += `${subdir}`)
            : (accumulatedUrls += `/${subdir}`);

        if (subdir === arraySubdirects[0]) {
            arraySubdirects[0] = "vitrine";
        }
        return accumulatedUrls;
    });

    const result = [];
    arraySubdirects.forEach((each, ind) => {
        const obj = {
            subdir: "",
            link: "",
        };

        if (each.slice(-2) === "np") each = "Nova Senha"; // n2

        obj.subdir = removeDashes(each);
        obj.link = arrayUrls[ind];
        result.push(obj);
    });

    return result;
}

/* COMMENTS
n1: the second loop will duplicate slashes '//' because the first one will be empty.
n2: do not show token like 40d6a570-106d-11ea-8090-41adbef3ce57np.
*/

// e.g
/*
const currentPath = '/cliente-de-manaus/luis/dados';
console.log(getBreadCrumbData(currentPath))
[ { subdir: 'vitrine', link: '/' },
  { subdir: 'cliente', link: '/cliente' },
  { subdir: 'luis', link: '/cliente/luis' },
  { subdir: 'dados', link: '' } ]
 */
