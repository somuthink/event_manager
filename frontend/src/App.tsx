import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/auth/authPage";

import { AuthProvider } from "./contexts/authContext";
import { Toaster } from "@/components/ui/toaster";
import { NewsPage } from "./pages/home/newsPage";
import { Navbar } from "./components/global/navbar";
// import { CreateRoute } from "./pages/create/routes";
import { CreateNewsPage } from "./pages/create/news";
import { CreateEventPage } from "./pages/create/event";

function App() {
    return (
        <AuthProvider>
            <div className="w-[100vw] h-[100vh] flex flex-col p-5 gap-5 items-center ">
                <Navbar></Navbar>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<NewsPage />} />
                    <Route path="/create"  >
                        <Route path="news" element={<CreateNewsPage />} />
                        <Route path="event" element={<CreateEventPage />} />
                    </Route>
                </Routes>

                <Toaster />
            </div>
        </AuthProvider>
    );
}

export default App;
