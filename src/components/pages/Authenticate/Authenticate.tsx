import { useRoutes } from "raviger";
import React from "react";
import Login from "./Login";
import ChangePassword from "./ChangePassword";
import Navbar from "../../shared/Navbar";

function Authenticate() {
    const routes = {
        '/login': () => (
            <Login />
        ),
        '/changePassword/:token': ({ token }: any) => (
            <>
                <Navbar showUser={false} />
                <div className="page-layout-container bg-white">
                    <div className="main-container overflow-hidden">
                        <ChangePassword token={token} />
                    </div>
                </div>
            </>
        ),
        '/': () => (
            <Login />
        ),
    }

    const route = useRoutes(routes, { basePath: '' })
    return <>{route}</>
}

export default Authenticate;