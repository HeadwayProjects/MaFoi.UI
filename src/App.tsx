import React, { Suspense } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "raviger";
import AuthenticatedContent from "./containers/AuthenticatedContent";

export function getBasePath() {
    return window.location.origin;
}

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback="loading...">
                <RouterProvider >
                    <AuthenticatedContent />
                </RouterProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </Suspense>
        </QueryClientProvider>
    )
}
export default App;
