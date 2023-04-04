import React from "react";
import * as auth from "../backend/auth"
import Login from "../components/pages/login";
import AuthenticatedContent from "./AuthenticatedContent";

function Container() {

    function isLoggedIn() {
        const token = auth.getAuthToken();
        return !!token;
    }

    return isLoggedIn() ? <AuthenticatedContent /> : <Login />

}

export default Container;