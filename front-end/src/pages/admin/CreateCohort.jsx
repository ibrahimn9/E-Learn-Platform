import React from "react";
import { AdminNav, CohortTable } from "../../components";
import { FaPlus } from "react-icons/fa6";
import images from "../../constants/images";

const CreateCohort = () => {
  return (
    <div className="h-auto min-h-screen bg-[#EFF5FF] overflow-hidden">
      <AdminNav />
      <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-16">Create Cohort</h1>
        <div className="mx-auto max-w-xl flex items-center justify-center gap-6 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
            <FaPlus />
            Add cohort
          </button>
        </div>
        <CohortTable />
      </div>
    </div>
  );
};

export default CreateCohort;
