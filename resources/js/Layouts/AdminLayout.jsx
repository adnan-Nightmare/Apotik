import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import { usePage } from "@inertiajs/react";

const AdminLayout = ({ children, noStyle, scroll = false, user }) => {
    const { notifs } = usePage().props;
    console.log(notifs);

    useEffect(() => {
        if (notifs && notifs.length > 0) {
            notifs.forEach((notif) => {
                if(notif.data == 0) return;
                toast[notif.type](
                    <div>
                        <b>{notif.title}</b>
                        <div>{notif.message}</div>
                    </div>,
                );
            });
        }
    }, [notifs]);

    return (
        <div className="d-flex bg-body-tertiary">
            <Sidebar />
            <div className="w-100">
                <Navbar user={user} />
                <div
                    className={noStyle ? " " : "p-xxl-4 vh-100"}
                    style={
                        scroll ? { overflow: "scroll" } : { overflow: "hidden" }
                    }
                >
                    {children}
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default AdminLayout;
