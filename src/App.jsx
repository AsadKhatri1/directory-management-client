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
import PrivateRoute from "./privateroute/PrivateRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard/resident/:id" element={<ResidentDetail />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/residents"
          element={
            <PrivateRoute>
              <Residents />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/newResident"
          element={
            <PrivateRoute>
              <NewResident />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/update-resident/:id"
          element={
            <PrivateRoute>
              <ResidentUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/addAdmin"
          element={
            <PrivateRoute>
              <AddAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/resident/invoice"
          element={
            <PrivateRoute>
              <Invoice />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/expense"
          element={
            <PrivateRoute>
              <Expense />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/expense/report"
          element={
            <PrivateRoute>
              <ExpenseReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/income/report"
          element={
            <PrivateRoute>
              <IncomeReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/expense/receipt/:id"
          element={
            <PrivateRoute>
              <Receipt />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
