import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { rec, masjid } from "../App";
const ExpenseForm = () => {
  const [recBalance, setRecBalance] = useContext(rec);
  const [masjidBalance, setMasjidBalance] = useContext(masjid);
  const [Title, setTitle] = useState("");
  const [Amount, setAmount] = useState("");
  const [Account, setAccount] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://directory-management-g8gf.onrender.com/api/v1/expense/addExpense",
        {
          Title,
          Amount,
        }
      );
      if (res.data.success) {
        console.log(Account);
        toast.success(res.data.message);
        setTitle("");
        setAmount("");
        setAccount("");
        if (Account === "rec") {
          // Ensure feeAmount is parsed as a number
          const feeAmountNumber = parseFloat(Amount);

          // Check if feeAmount is a valid number
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }

          // Retrieve the existing balances from local storage
          const prevRecBalance =
            JSON.parse(localStorage.getItem("recBalance")) || 0;

          // Update the balances
          const newRecBalance = prevRecBalance - Amount;

          // Set the new balances in local storage
          // localStorage.setItem("recBalance", JSON.stringify(newRecBalance));
          // localStorage.setItem("masjidBalance", JSON.stringify(newMasjidBalance));
          setRecBalance(newRecBalance);
        }
        if (Account === "masjid") {
          // Ensure feeAmount is parsed as a number
          const feeAmountNumber = parseFloat(Amount);

          // Check if feeAmount is a valid number
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }

          // Retrieve the existing balances from local storage
          const prevMasjidBalance =
            JSON.parse(localStorage.getItem("masjidBalance")) || 0;

          // Update the balances
          const newMasjidBalance = prevMasjidBalance - Amount;

          // Set the new balances in local storage
          // localStorage.setItem("recBalance", JSON.stringify(newRecBalance));
          // localStorage.setItem("masjidBalance", JSON.stringify(newMasjidBalance));
          setMasjidBalance(newMasjidBalance);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <main className="main-container text-center mt-5">
        <h2>LIST A NEW EXPENSE</h2>
        <form
          action="post"
          className="w-100 mt-3 border text-center"
          onSubmit={submitHandler}
        >
          <input
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="FullName"
            id="FullName"
            placeholder="Title"
            className="w-75 my-3 text-white py-2"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid white",
              borderRadius: "12px",
              textIndent: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          />
          <br />
          <input
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            name="amount"
            id="Email"
            placeholder="Amount"
            className="w-75 my-3 text-white py-2"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid white",
              borderRadius: "12px",
              textIndent: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          />{" "}
          <br />
          <select
            onChange={(e) => setAccount(e.target.value)}
            className="form-select my-3 w-75  py-2 "
            style={{
              borderBottom: "1px solid white",
              borderRadius: "12px",
              textIndent: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            <option>Select Account</option>
            <option value="rec">REC</option>
            <option value="masjid">Masjid</option>
          </select>
          <br />
          <button
            type="submit"
            className="btn btn-success w-75 mt-5"
            style={{ borderRadius: "12px" }}
          >
            ADD
          </button>
        </form>
      </main>
    </>
  );
};

export default ExpenseForm;
