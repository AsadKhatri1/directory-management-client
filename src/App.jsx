import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Auth from "./pages/Auth.jsx";
import Residents from "./pages/Residents.jsx";
import NewResident from "./pages/NewResident.jsx";
import AddAdmin from "./pages/AddAdmin.jsx";
import ResidentDetail from "./pages/ResidentDetail.jsx";
import Invoice from "./pages/Invoice.jsx";
import Expense from "./pages/Expense.jsx";
const rec = createContext();
const masjid = createContext();
function App() {
  // balance of rec
  const [recBalance, setRecBalance] = useState(() => {
    // Retrieve the count from localStorage if it exists
    const savedBalance = localStorage.getItem("recBalance");
    return savedBalance !== null ? JSON.parse(savedBalance) : 0;
  });
  useEffect(() => {
    localStorage.setItem("recBalance", JSON.stringify(recBalance));
  }, [recBalance]);
  // balance of masjid
  const [masjidBalance, setMasjidBalance] = useState(() => {
    // Retrieve the count from localStorage if it exists
    const savedMasjidBalance = localStorage.getItem("masjidBalance");
    return savedMasjidBalance !== null ? JSON.parse(savedMasjidBalance) : 0;
  });
  useEffect(() => {
    localStorage.setItem("masjidBalance", JSON.stringify(masjidBalance));
  }, [masjidBalance]);
  return (
    <rec.Provider value={[recBalance, setRecBalance]}>
      <masjid.Provider value={[masjidBalance, setMasjidBalance]}>
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/dashboard/resident/:id"
              element={<ResidentDetail />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/residents" element={<Residents />} />
            <Route path="/dashboard/newResident" element={<NewResident />} />
            <Route path="/dashboard/addAdmin" element={<AddAdmin />} />
            <Route path="/dashboard/resident/invoice" element={<Invoice />} />
            <Route path="/dashboard/expense" element={<Expense />} />
          </Routes>
        </Router>
      </masjid.Provider>
    </rec.Provider>
  );
}

export default App;
export { rec, masjid };
