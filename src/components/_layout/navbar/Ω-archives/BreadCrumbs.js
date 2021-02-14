import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link } from "react-router-dom"; // n3
import PropTypes from "prop-types";
// helpers
import getBreadCrumbData from "../../../utils/getBreadCrumbData";
import truncateWords from "../../../utils/string/truncateWords";

BreadCrumbs.propTypes = {
    currentPath: PropTypes.object,
};

export default function BreadCrumbs({ history }) {
    const currPath = history.location.pathname;
    const showBreadCrumbs = (currentPath) => {
        const isHome = currentPath === "/";
        const data = getBreadCrumbData(currentPath);
        const showData = data.map((obj) => {
            const { link } = obj;
            let subdirName;
            let key;
            subdirName = key = truncateWords(obj.subdir, 30); // n2
            if (link === "")
                return (
                    <Typography key={key} color="textPrimary">
                        {subdirName}
                    </Typography>
                ); // n1

            return (
                <Link key={key} color="inherit" to={link}>
                    {subdirName}
                </Link>
            );
        });

        return (
            !isHome && (
                <Breadcrumbs aria-label="breadcrumb">{showData}</Breadcrumbs>
            )
        );
    };

    return (
        <div style={{ marginLeft: "20px" }}>{showBreadCrumbs(currPath)}</div>
    );
}

/* COMMENTS
n1: means it is the last one, does not need link, only paramName
n2: ref: https://stackoverflow.com/questions/16975350/assign-multiple-variables-to-the-same-value-in-javascript/16975373
n3: react-router is better because does not need to reload the page.
prior:
import { default as LinkMaterial } from '@material-ui/core/Link';
ref: https://stackoverflow.com/questions/43172750/can-you-use-es6-import-alias-syntax-for-react-components
*/
