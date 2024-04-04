import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const data = {
  labels: ["1CP", "2CP", "1CS", "2CS", "3CS", "Other"],
  datasets: [
    {
      label: "Active Accounts",
      data: [100, 150, 200, 250, 300, 150], // Sample data, replace with your actual data
      backgroundColor: ["#2E86FB", "#F8A543", "#B34168", "#DEEBFF", "#0010A2AB", "#57D9A3"],
      hoverBackgroundColor: "#4F46E5",
      borderWidth: 1,
      barPercentage: 0.3,
      categoryPercentage: 0.8,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Tracking the Active Accounts by Year",
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

const BarChart = () => {
  return (
    <div className="text-center sm:col-span-3">
      <div className="rounded-lg overflow-hidden max-h-[450px] shadow-md bg-white px-6 py-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
