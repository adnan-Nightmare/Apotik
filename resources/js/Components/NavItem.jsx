import { Link, usePage } from "@inertiajs/react";

const NavItem = ({ href, icon, label }) => {
    const { url } = usePage();

    const isAktif = url.startsWith(href);

    return (
        <li className="nav-item">
            <Link
                href={href}
                className={`nav-link ${isAktif ? "active" : "text-muted"}`}
                aria-current="page"
            >
                <i className={`bi ${icon} fa-fw me-2`} />
                {label}
            </Link>
        </li>
    );
};

export default NavItem;
