import React, { Suspense } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Container from "./containers/Container";
import { ToastContainer } from "react-toastify";

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback="loading...">
                <Container />
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
