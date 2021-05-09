import React, { useState } from "react";

import { useHistory } from "react-router-dom";

const validate = (values) => {
    let errors = {};

    if (!values.email) {
        errors.email = "Email not given";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
    }
    if (!values.password) {
        errors.password = "Password is required";
    }

    return errors;
};

const LoginForm = () => {
    const history = useHistory();

    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validate(values));

        // fetch content
        fetch("http://localhost:8081/check_login", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {
                    localStorage.setItem("username", values.email);

                    history.push("/mypage");
                } else {
                    // TODO: add some error object saying that the password is incorrect
                    history.push("/signup");
                }
            });
    };

    return (
        <div className="content-right">
            <form onSubmit={handleSubmit} className="form" noValidate>
                <p>Login to your account!</p>
                <div className="inputs">
                    <label className="form-label">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div className="inputs">
                    <label className="form-label">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button className="input-btn" type="submit">
                    Sign In
                </button>
                <span className="input-login">
                    Sign Up <a href="/signup">here</a> if you don't have an account!
                </span>
            </form>
        </div>
    );
};
export default LoginForm;
