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
import Receipt from "./components/Receipt.jsx";
import ExpenseReport from "./components/ExpenseReport.jsx";
import IncomeReport from "./components/IncomeReport.jsx";
import ResidentUpdate from "./pages/ResidentUpdate.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard/resident/:id" element={<ResidentDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/residents" element={<Residents />} />
        <Route path="/dashboard/newResident" element={<NewResident />} />
        <Route
          path="/dashboard/updateResident/:id"
          element={<ResidentUpdate />}
        />
        <Route path="/dashboard/addAdmin" element={<AddAdmin />} />
        <Route path="/dashboard/resident/invoice" element={<Invoice />} />
        <Route path="/dashboard/expense" element={<Expense />} />
        <Route path="/dashboard/expense/report" element={<ExpenseReport />} />
        <Route path="/dashboard/income/report" element={<IncomeReport />} />
        <Route path="/dashboard/expense/receipt/:id" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;
