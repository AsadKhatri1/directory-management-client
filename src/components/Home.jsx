import React, { PureComponent, useContext, useEffect, useState } from "react";
import { FaHouseUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

import { Audio } from "react-loader-spinner";
import { IoIosWallet } from "react-icons/io";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import moment from "moment";

const Home = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  // getting masjid & rec balance
  const getMasjidBalance = async () => {
    const res = await axios.get(
      `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
    );
    if (res.data.success) {
      setMasjidBalance(res.data.acc.Balance);
    }
  };
  const getRecBalance = async () => {
    const res = await axios.get(
      `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
    );
    if (res.data.success) {
      setRecBalance(res.data.acc.Balance);
    }
  };

  useEffect(() => {
    getMasjidBalance();
    getRecBalance();
  }, []);

  const [recBalance, setRecBalance] = useState(0);
  const [masjidBalance, setMasjidBalance] = useState(0);
  const [residents, setResidents] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  //   calling residents to know total number
  const allResidents = async () => {
    const res = await axios.get(`${backendURL}/api/v1/resident/getResidents`);
    if (res?.data?.success) {
      setResidents(res.data.residents);
    }
    try {
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };

  useEffect(() => {
    allResidents();
    // allAdmins();
  }, []);

  // calling income list
  const allIncomes = async () => {
    const res = await axios.get(`${backendURL}/api/v1/income/allIncomes`);
    if (res.data.success) {
      setIncomes(res.data.incomeList);
    }
  };

  const allExpenses = async () => {
    const res = await axios.get(`${backendURL}/api/v1/expense/expenses`);
    if (res.data.success) {
      setExpenses(res.data.expenseList);
    }
  };

  useEffect(() => {
    allResidents();
    allExpenses();
    allIncomes();
  }, []);

  // Preprocess the income data
  const incomeData = Array.from({ length: 12 }, (_, i) => {
    const month = moment().subtract(i, "months").format("YYYY-MM");
    const totalIncome = incomes
      .filter((income) => moment(income.createdAt).format("YYYY-MM") === month)
      .reduce((sum, income) => sum + Number(income.Amount), 0);

    return {
      name: moment().subtract(i, "months").format("MMM YYYY"), // e.g., "Sep 2023"
      income: totalIncome,
    };
  }).reverse(); // Reverse to show from oldest to newest

  // Preprocess the expenses data
  const expenseData = Array.from({ length: 12 }, (_, i) => {
    const month = moment().subtract(i, "months").format("YYYY-MM");
    const totalExpenses = expenses
      .filter(
        (expense) => moment(expense.createdAt).format("YYYY-MM") === month
      )
      .reduce((sum, expense) => sum + Number(expense.Amount), 0);

    return {
      name: moment().subtract(i, "months").format("MMM YYYY"), // e.g., "Sep 2023"
      expenses: totalExpenses,
    };
  }).reverse(); // Reverse to show from oldest to newest

  console.log(expenses);

  return (
    <main className="main-container">
      <div className="main-title">
        <h1>Dashboard</h1>
      </div>

      <div className="main-cards">
        <div className="cards">
          <div className="card-inner">
            <h6>REC Account Balance</h6>
            <IoIosWallet className="card-icon" />
          </div>
          <h3 className="my-2 card-number">
            {!recBalance ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="#03bb50"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              `Rs. ${recBalance}`
            )}
          </h3>
        </div>

        <div className="cards">
          <div className="card-inner">
            <h6>Masjid Account Balance</h6>
            <IoIosWallet className="card-icon" />
          </div>
          <h3 className="my-2 card-number">
            {!masjidBalance ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="#03bb50"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              `Rs. ${masjidBalance}`
            )}
          </h3>
        </div>

        <div className="cards">
          <div className="card-inner">
            <h6>Residents</h6>
            <RiAdminFill className="card-icon" />
          </div>
          <h3 className="my-2 card-number">
            {residents.length < 1 ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="#03bb50"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              residents.length
            )}
          </h3>
        </div>
      </div>
      {/* graphs */}

      <div className="row mt-5">
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={incomeData}
              width={500}
              height={300}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="income" fill="#03bb50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <h3 className="text-center mt-3" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: 600 }}>
            INCOME CHART
          </h3>
        </div>
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={expenseData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="expenses" fill="#ef5350" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <h3 className="text-center mt-3" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: 600 }}>
            EXPENSE CHART
          </h3>
        </div>
      </div>
      <div className="row"></div>
    </main>
  );
};

export default Home;
