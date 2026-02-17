import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

const Navbar = () => {
    const { auth } = usePage().props;
    const [isMenu, setMenu] = useState(false);

    const btnMenu = () => {
        setMenu(!isMenu);
    };

    const logoutHandler = async (e) => {
        e.preventDefault();
        router.post("/logout");
    };
    return (
        <nav
            className="bg-white border-bottom w-100 navbar navbar-expand-lg"
            style={{ height: "75px" }}
        >
            <div className="container-fluid px-3 d-flex justify-content-end">
                <img
                    src="https://ui-avatars.com/api/?name=a&color=FFFFFF&background=oklch%280.141+0.005+285.823%29"
                    alt="avatar"
                    className="rounded-circle"
                    style={{
                        objectFit: "cover",
                        width: "35px",
                        cursor: "pointer",
                    }}
                    onClick={btnMenu}
                />

                {isMenu && (
                    <div className="position-absolute top-100 card" style={{ zIndex: "1" }}>
                        <div
                            className="bg-white border rounded card-body"
                            style={{ width: "12rem" }}
                        >
                            <p className="fw-bold">{auth.user.name}</p>
                            <p className="small text-muted mb-1">
                                {auth.user.email}
                            </p>
                            <hr />
                            <Link
                                onClick={logoutHandler}
                                className="bg-danger-soft-hover"
                            >
                                <i className="bi bi-power fa-fw me-2"></i>
                                Keluar
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
