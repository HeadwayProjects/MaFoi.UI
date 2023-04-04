import React, { Suspense } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Container from "./containers/Container";

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback="loading...">
                <Container />
            </Suspense>
        </QueryClientProvider>
    )
}
export default App;
