import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Auth from "./pages/Auth.jsx";
import Residents from "./pages/Residents.jsx";
import NewResident from "./pages/NewResident.jsx";
import AddAdmin from "./pages/AddAdmin.jsx";
import ResidentDetail from "./pages/ResidentDetail.jsx";
import Invoice from "./pages/Invoice.jsx";
import { useEffect } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />}></Route>
        <Route
          path="/dashboard/resident/:id"
          element={<ResidentDetail />}
        ></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/residents" element={<Residents />} />
        <Route path="/dashboard/newResident" element={<NewResident />} />
        <Route path="/dashboard/addAdmin" element={<AddAdmin />} />
        <Route path="/dashboard/resident/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
