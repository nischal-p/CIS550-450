import React from "react";

import LoginForm from "./LoginForm";

function Login() {
    return (
        <>
            <div className="form-parent">
                <div className="content-left">
                    <img
                        className="form-img"
                        src="https://source.unsplash.com/cv4bk-aedJE"
                        alt=""
                    />
                </div>
                <LoginForm />
            </div>
        </>
    );
}

export default Login;
