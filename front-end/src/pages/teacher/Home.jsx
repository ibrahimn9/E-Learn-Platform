import React from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import images from "../../constants/images";
import { CiSquarePlus } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateContext";

const Home = () => {
  const navigate = useNavigate();

  const { userData } = useStateContext();

  return (
    <div className="relative pb-10 bg-[#EFF5FF] w-full overflow-hidden min-h-screen">
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          <div className="flex gap-2 mt-6">
            <div className="basis-[70%] flex-grow">
              <h1 className="text-3xl font-bold text-primary mb-4">
                Teacher Dashboard
              </h1>
              <div className="mt-10">
                <p className="text-gray font-medium">Upload Course Materials</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                    onClick={() =>
                      navigate(
                        `/teacher/${userData.userData?.id}/course-management`
                      )
                    }
                    className="bg-white cursor-pointer text-primary rounded-[3px] overflow-hidden left-border flex p-4 md:justify-center items-center gap-10"
                  >
                    <img src={images.shape} alt="add-file" />
                    <div className="flex flex-col items-center gap-2">
                      <p>Add Chapter</p>
                      <button className="px-3 py-1 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
                        Dispose
                      </button>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      navigate(
                        `/teacher/${userData.userData?.id}/mooc-management`
                      )
                    }
                    className="bg-white cursor-pointer text-primary rounded-[3px] overflow-hidden left-border flex p-4 md:justify-center items-center gap-10"
                  >
                    <img src={images.addVideo} alt="add-file" />
                    <div className="flex flex-col items-center gap-2">
                      <p>Add MOOC</p>
                      <button className="px-3 py-1 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
                        Dispose
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-gray font-medium">Insert Resources</p>
                <div
                  onClick={() =>
                    navigate(
                      `/teacher/${userData.userData?.id}/resource-management`
                    )
                  }
                  className="cursor-pointer mt-3 bg-white rounded-md flex px-10 py-3 items-center justify-between"
                >
                  <div className="flex items-center gap-4 text-primary text-lg">
                    <CiSquarePlus className="text-[28px] font-bold" />
                    <p>Add Resource</p>
                  </div>
                  <button className="flex justify-center w-20 py-1 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
                    Insert
                  </button>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-gray font-medium">
                  Insert Learning Activities
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white cursor-pointer text-primary rounded-[3px] overflow-hidden top-border flex p-4 md:justify-center items-center gap-10">
                    <div onClick={() =>
                    navigate(
                      `/teacher/${userData.userData?.id}/quiz-management`
                    )
                  } className="flex flex-col items-start gap-4">
                      <p>Add Quiz</p>
                      <p className="text-gray text-sm">
                        Create a small quiz for your students to evaluate their
                        understanding.
                      </p>
                      <button className="flex justify-center w-[120px] py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
                        Create
                      </button>
                    </div>
                  </div>
                  <div className="bg-white cursor-pointer text-primary rounded-[3px] overflow-hidden top-border flex p-4 md:justify-center items-center gap-10">
                    <div className="flex flex-col items-start gap-4">
                      <p>Add Assignment</p>
                      <p className="text-gray text-sm">
                        Create an assignment to do a homework remotly.
                      </p>
                      <button className="flex justify-center w-[120px] py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]">
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block basis-[28%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
