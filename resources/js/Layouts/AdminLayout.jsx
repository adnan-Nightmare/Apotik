import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const AdminLayout = ({ children, noStyle, scroll = false, user }) => {
    return (
        <div className="d-flex bg-body-tertiary">
            <Sidebar />
            <div className="w-100">
            <Navbar user={user}/>
                <div className={noStyle ? " " : "p-xxl-4 vh-100"} style={scroll ? { overflow: "scroll" } : { overflow: "hidden" }}>{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
