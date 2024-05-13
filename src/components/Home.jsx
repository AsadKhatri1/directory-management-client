import React, { PureComponent, useEffect, useState } from "react";
import { FaHouseUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

import { Audio } from "react-loader-spinner";
import { IoCarSport } from "react-icons/io5";
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
  const allResidents = async () => {
    const res = await axios.get(
      "https://directory-management.onrender.com/api/v1/resident/getResidents"
    );
    if (res?.data?.success) {
      setResidents(res.data.residents);
    }
    try {
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };

  //   calling admins to know total number
  const allAdmins = async () => {
    const res = await axios.get(
      "https://directory-management.onrender.com/api/v1/admin/getAdmin"
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
    allResidents();
    allAdmins();
  }, []);
  residents.map((item, i) => {
    cars = cars + item.vehicles.length;
    console.log(cars);
  });
  return (
    <main className="main-container">
      <div className="main-title">
        <h1>Dashboard</h1>
      </div>

      <div className="main-cards">
        <div className="cards">
          <div className="card-inner">
            <h6>RESIDENTS</h6>
            <FaHouseUser className="card-icon" />
          </div>
          <h1>
            {residents.length < 1 ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="white"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              residents.length
            )}
          </h1>
        </div>
        <div className="cards">
          <div className="card-inner">
            <h6>Admins</h6>
            <RiAdminFill className="card-icon" />
          </div>
          <h1>
            {admins.length < 1 ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="white"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              admins.length
            )}
          </h1>
        </div>
        <div className="cards">
          <div className="card-inner">
            <h6>Vehicles</h6>
            <IoCarSport className="card-icon" />
          </div>
          <h1>
            {cars < 1 ? (
              <Audio
                height="50"
                width="50"
                radius="9"
                color="white"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              cars
            )}
          </h1>
        </div>
      </div>

      <div className="charts">
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="pv"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="uv"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Home;
