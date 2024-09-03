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
const Home = () => {
  // getting masjid & rec balance
  const getMasjidBalance = async () => {
    const res = await axios.get(
      `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
    );
    if (res.data.success) {
      setMasjidBalance(res.data.acc.Balance);
    }
  };
  const getRecBalance = async () => {
    const res = await axios.get(
      `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
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
  const [admins, setAdmins] = useState([]);
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  //   calling residents to know total number
  // const allResidents = async () => {
  //   const res = await axios.get(
  //     "https://directory-management-g8gf.onrender.com/api/v1/resident/getResidents"
  //   );
  //   if (res?.data?.success) {
  //     setResidents(res.data.residents);
  //   }
  //   try {
  //   } catch (err) {
  //     toast(err.response?.data?.message);
  //   }
  // };

  // calling admins to know total number
  const allAdmins = async () => {
    const res = await axios.get(
      "https://directory-management-g8gf.onrender.com/api/v1/admin/getAdmin"
    );
    if (res?.data?.success) {
      setAdmins(res.data.admins);
    }
    try {
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };
  let cars = 0;
  useEffect(() => {
    // allResidents();
    allAdmins();
  }, []);

  residents.map((item, i) => {
    cars = cars + item.vehicles.length;
  });
  return (
    <main className="main-container">
      <div className="main-title">
        <h1>Dashboard</h1>
      </div>

      <div className="main-cards">
        <div
          className="cards"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
        >
          <div className="card-inner">
            <h6 className="opacity-50">REC Account Balance</h6>
            <IoIosWallet className="card-icon" />
          </div>
          <h3 className="my-2 card-number" style={{ color: "#03bb50" }}>
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

        <div
          className="cards"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
        >
          <div className="card-inner">
            <h6 className="opacity-50">Masjid Account Balance</h6>
            <IoIosWallet className="card-icon" />
          </div>
          <h3 className="my-2 card-number" style={{ color: "#03bb50" }}>
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
        <div
          className="cards"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
        >
          <div className="card-inner">
            <h6 className=" opacity-50">Admins</h6>
            <RiAdminFill className="card-icon" />
          </div>
          <h3 className="my-2 card-number" style={{ color: "#03bb50" }}>
            {admins.length < 1 ? (
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
              admins.length
            )}
          </h3>
        </div>
      </div>
      {/* graphs */}

      <div className="row">
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#03bb50"
                activeBar={<Rectangle fill="#03c303" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#efc18f"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#03bb50"
                activeBar={<Rectangle fill="#03c303" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#efc18f"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="row">
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#03bb50"
                activeBar={<Rectangle fill="#03c303" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#efc18f"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="charts col-md-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#03bb50"
                activeBar={<Rectangle fill="#03c303" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#efc18f"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Home;
