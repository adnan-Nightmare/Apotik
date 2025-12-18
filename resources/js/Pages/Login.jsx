import { useForm } from "@inertiajs/react";
import { useState } from "react";

const Login = ({ nama_app }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors } = useForm({
        email: "",
        password: "",
    });

    const loginHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post("/admin/login", {
            onFinish: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <section className="vh-100">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-7 px-0 d-none d-sm-block">
                        <img
                            src="https://images.unsplash.com/photo-1576602975754-efdf313b9342?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBoYXJtYWN5fGVufDB8fDB8fHww"
                            alt="photo"
                            className="w-100 vh-100"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <div className="col-sm-5">
                        <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <h4>{nama_app}</h4>
                            <h3>Sign In</h3>

                            <form className="mt-3" onSubmit={loginHandler}>
                                <div class="mb-3" style={{ width: "23rem" }}>
                                    <label
                                        for="exampleFormControlInput1"
                                        className="form-label"
                                    >
                                        Email address
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback d-block">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <div class="mb-3" style={{ width: "23rem" }}>
                                    <label
                                        for="exampleFormControlInput1"
                                        className="form-label"
                                    >
                                        Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback d-block">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="checkDefault"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="checkDefault"
                                    >
                                        Remember Me
                                    </label>
                                </div>

                                <button
                                    className="btn btn-primary w-100 mt-3"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
