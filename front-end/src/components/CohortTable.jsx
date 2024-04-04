import React, { useState } from "react";
import images from "../constants/images";
import { IoSearchOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";

const CohortTable = () => {
  const [filters, setFilters] = useState({
    className: "",
    groupNumber: "",
    specialty: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  return (
    <div className="">
      {/* Filter options */}
      <div className="flex justify-between items-center space-x-4 my-4 overflow-x-auto min-w-[600px]">
        <div className="flex items-center bg-[#F9F9FB] border border-[#D5D5D5] rounded-lg whitespace-nowrap">
          {/* Status filter */}
          <button className="p-2 border-r border-[#D5D5D5] h-[35px]">
            <img src={images.filterIcon} alt="filter" />
          </button>
          <select
            name="className"
            value={filters.className}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Class name</option>
            <option value="active">1CP</option>
            <option value="inactive">2CP</option>
            <option value="inactive">1CS</option>
            <option value="inactive">2CS</option>
            <option value="inactive">3CS</option>
          </select>

          {/* Module filter */}
          <select
            name="group number"
            value={filters.groupNumber}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-l border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Group number</option>
            {/* Add module options here */}
          </select>

          {/* Type filter */}
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-l border-r border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Specialty</option>
            {/* Add module options here */}
          </select>
          <button
            className="text-[#B34168] bg-white font-medium flex items-center gap-2 px-4"
            onClick={() => setFilters({ status: "", module: "", type: "" })}
          >
            <RxReset />
            Reset Filters
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white gap-2 border border-[#D5D5D5] px-3 py-2 h-[35px] rounded-md">
          <IoSearchOutline className="text-[#979797] text-xl" />
          <input
            type="text"
            placeholder="Search cohort"
            className="outline-none"
          />
        </div>
      </div>

      {/* Teacher table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
          <thead>
            <tr>
              <th className="w-1/4 p-2">Class name</th>
              <th className="w-1/4 p-2">Cohort ID</th>
              <th className="w-1/4 p-2">Group number</th>
              <th className="w-1/4 p-2">Teachers</th>
              <th className="w-1/4 p-2">Specialty</th>
              <th className="w-1/4 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
            {/* Replace the static data with dynamic data */}
            <tr>
              <td className="p-4">1CS</td>
              <td className="p-4">10</td>
              <td className="p-4">1</td>
              <td className="p-4">35, 4, 53, 21</td>
              <td className="p-4">null</td>
              <td className="p-4 flex justify-center">
                <div className="border border-[#D5D5D5] rounded-lg flex gap-2 items-center justify-center w-[70px] h-[28px] text-center">
                  <button>
                    <img
                      src={images.editIcon}
                      className="w-[16px] aspect-square"
                      alt="edit-btn"
                    />
                  </button>
                  <div className="bg-[#D5D5D5] h-[28px] w-[1px]" />
                  <button>
                    <img
                      src={images.deleteIcon}
                      className="w-[16px] aspect-square"
                      alt="delete-btn"
                    />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-4">1CS</td>
              <td className="p-4">10</td>
              <td className="p-4">1</td>
              <td className="p-4">35, 4, 53, 21</td>
              <td className="p-4">null</td>
              <td className="p-4 flex justify-center">
                <div className="border border-[#D5D5D5] rounded-lg flex gap-2 items-center justify-center w-[70px] h-[28px] text-center">
                  <button>
                    <img
                      src={images.editIcon}
                      className="w-[16px] aspect-square"
                      alt="edit-btn"
                    />
                  </button>
                  <div className="bg-[#D5D5D5] h-[28px] w-[1px]" />
                  <button>
                    <img
                      src={images.deleteIcon}
                      className="w-[16px] aspect-square"
                      alt="delete-btn"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CohortTable;
