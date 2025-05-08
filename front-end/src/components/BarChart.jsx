import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

import cohort from "../services/cohort";
import _class from "../services/class";

const BarChart = ({ users }) => {
  const [cohorts, setCohorts] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchCohorts = async () => {
    const res = await cohort.getAll();
    setCohorts(res.data.data);
  };

  const fetchClasses = async () => {
    const res = await _class.getAll();
    setClasses(res.data.data);
  };

  useEffect(() => {
    fetchCohorts();
    fetchClasses();
  }, []);
  const classLevels = [...new Set(classes.map((cls) => cls.name))];
  const filterActiveStudentsByCohort = (cohortName) =>
    users
      ?.filter((user) => user.role === "student")
      .filter(
        (student) =>
          cohorts.find((cohort) => cohort.id === student.idCohorte)?.name ===
            cohortName && student.isVerified === 1
      );

  const filterInactiveStudentsByCohort = (cohortName) =>
    users
      ?.filter((user) => user.role === "student")
      .filter(
        (student) =>
          cohorts.find((cohort) => cohort.id === student.idCohorte)?.name ===
            cohortName && student.isVerified !== 1
      );

  // Data for active accounts
  const activeData = {
    label: "Active Accounts",
    data: [
      filterActiveStudentsByCohort(classLevels[0]).length,
      filterActiveStudentsByCohort(classLevels[1]).length,
      filterActiveStudentsByCohort(classLevels[2]).length,
      filterActiveStudentsByCohort(classLevels[3]).length,
      filterActiveStudentsByCohort(classLevels[4]).length,
      users?.filter((user) => user.role === "teacher" && user.isVerified === 1)
        .length,
    ],
    backgroundColor: "#2E86FB",
    hoverBackgroundColor: "#4F46E5",
    borderWidth: 1,
    barPercentage: 0.3,
    categoryPercentage: 0.8,
  };

  // Data for inactive accounts
  const inactiveData = {
    label: "Inactive Accounts",
    data: [
      filterInactiveStudentsByCohort(classLevels[0]).length,
      filterInactiveStudentsByCohort(classLevels[1]).length,
      filterInactiveStudentsByCohort(classLevels[2]).length,
      filterInactiveStudentsByCohort(classLevels[3]).length,
      filterInactiveStudentsByCohort(classLevels[4]).length,
      users?.filter((user) => user.role === "teacher" && user.isVerified === 0)
        .length, // No inactive teachers
      ,
    ],
    backgroundColor: "#FFD700",
    hoverBackgroundColor: "#FFA500",
    borderWidth: 1,
    barPercentage: 0.3,
    categoryPercentage: 0.8,
  };

  // Chart data
  const data = {
    labels: [...classLevels, "Teachers"],
    datasets: [activeData, inactiveData],
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Tracking the Active and Inactive Accounts by Year",
        font: {
          size: 14,
          weight: "bold",
        },
        textAlign: "start",
        color: "#1C1C1C",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        right: 0, // Adjust the padding between the right edge of the chart and the end of the last bar
      },
    },
    indexAxis: "x", // Indicates labels are on the x-axis
  };

  return (
    <div className="text-center sm:col-span-3">
      <div className="rounded-lg overflow-hidden max-h-[450px] shadow-md bg-white px-6 py-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
