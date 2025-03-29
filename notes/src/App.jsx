import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import CreateNotePage from "./pages/CreateNotePage";
import EditNotePage from "./pages/EditNotePage";
import DeleteNotePage from "./pages/DeleteNotePage";
import { AccountProvider } from "./providers/AccountProvider";
import "./App.css";

const App = () => {
    return (
        <AccountProvider>
            <Router>
                <Navbar />
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create" element={<CreateNotePage />} />
                        <Route path="/edit/:id" element={<EditNotePage />} />
                        <Route path="/delete/:id" element={<DeleteNotePage />} />
                    </Routes>
                </div>
            </Router>
        </AccountProvider>
    );
};

export default App;
