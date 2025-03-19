import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/auth/authPage";

import { Toaster } from "@/components/ui/toaster";
import { HomePage } from "./pages/home/homePage";
import { Navbar } from "./components/global/navbar";

function App() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col p-5 gap-5">
      <Navbar></Navbar>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
