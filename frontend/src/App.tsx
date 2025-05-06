import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/auth/authPage";

import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "./components/global/navbar";
import { AuthProvider } from "./contexts/authContext";
import { NewsPage } from "./pages/news/newsPage";
// import { CreateRoute } from "./pages/create/routes";
import { CreateEventPage } from "./pages/create/event";
import { CreateNewsPage } from "./pages/create/news";
import { EventsPage } from "./pages/event/events";
import { EventPage } from "./pages/event/event";

function App() {
    return (
        <AuthProvider>
            <div className=""></div>
            <div className="w-[100vw] min-h-screen overflow-y-auto  flex flex-col p-5 gap-5 items-center ">
                <Navbar></Navbar>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<NewsPage />} />
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
