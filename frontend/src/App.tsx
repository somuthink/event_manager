import { Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "./pages/auth";

import { Toaster } from "@/components/ui/toaster";
import { CreateEventPage, CreateNewsPage } from "@/pages/create";
import { Navbar } from "./components/global/navbar";
import { AuthProvider } from "./contexts/authContext";
import { DashPage } from "./pages/dash/dash";
import { EventPage, EventsPage } from "./pages/event";
import { NewsEntityPage, NewsPage } from "./pages/news";

function App() {
    return (
        <AuthProvider>
            <div className="  w-[100vw] min-h-screen    overflow-y-auto  flex flex-col p-5 gap-5 items-center    ">
                <Navbar />
                <Routes>

                    <Route path="/" element={<DashPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/news/:id" element={<NewsEntityPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventPage />} />
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
