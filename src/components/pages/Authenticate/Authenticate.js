import { useRoutes } from "raviger";
import React from "react";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

function Authenticate() {
    const routes = {
        '/login': () => (
            <Login />
        ),
        '/forgotPassword': () => (
            <ForgotPassword />
        ),
        '/': () => (
            <Login />
        ),
    }

    const route = useRoutes(routes, { basePath: '' })
    return <>{route}</>
}

export default Authenticate;