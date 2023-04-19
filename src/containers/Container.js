import React from "react";
import * as auth from "../backend/auth"
import AuthenticatedContent from "./AuthenticatedContent";
import Authenticate from "../components/pages/Authenticate/Authenticate";

function Container() {

    function isLoggedIn() {
        const token = auth.getAuthToken();
        return !!token;
    }

    return isLoggedIn() ? <AuthenticatedContent /> : <Authenticate />

}

export default Container;