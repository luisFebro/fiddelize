import { Link } from "react-router-dom";
import ShowPasswordForm from "auth/pages/access-password/dashboard-client-admin/ShowPasswordForm";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

// TEST
// let date = new Date();
// const daysBefore = 2;
// date.setDate(date.getDate() - daysBefore);
// END

export default function HiddenVerifPass({ userData }) {
    const showChangePassBtn = () => (
        <section className="my-5 container-center">
            <Link to="/nova-senha/mudar" className="no-text-decoration">
                <ButtonFab
                    size="large"
                    title="Mudar senha do seu app"
                    onClick={null}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                />
            </Link>
        </section>
    );

    return (
        <div className="hidden-content--root text-normal">
            {showChangePassBtn()}
            <ShowPasswordForm isFromCliAdminDash />
        </div>
    );
}

/* ARCHIVES
wrong date because lack of time recording in db
<DateWithIcon
    date={userData.updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
/>
*/
