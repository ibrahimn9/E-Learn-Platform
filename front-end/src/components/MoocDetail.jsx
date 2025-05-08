import React, { useState, useEffect } from "react";
import images from "../constants/images";

const MoocDetail = ({ moocs }) => {
  const [selectedMooc, setSelectedMooc] = useState(moocs[0]);

  if (moocs.length)
    return (
      <div className="bg-white px-4 md:px-8 lg:px-[100px] py-6 mt-4 rounded-md h-auto min-h-[500px]">
        <div className="border border-primary rounded-md p-8 ">
          <iframe
            title={selectedMooc.title}
            src={`http://localhost:3000${selectedMooc.link}`}
            className="w-full h-full rounded-md min-h-[500px]"
            allowFullScreen
          />
        </div>
        <p className="text-center text-xl font-semibold text-primary mt-4">
          {selectedMooc?.title}
        </p>
        <div className="mt-4">
          <p className="text-primary font-medium text-lg mb-4">Others</p>
          <div className="flex gap-4 overflow-x-scroll max-w-full pb-4">
            {moocs
              .filter((mooc) => mooc.id !== selectedMooc.id)
              .map((mooc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMooc(mooc)}
                  className="border border-gray rounded-md min-h-[150px] min-w-[200px] cursor-pointer"
                >
                  <div className="flex justify-center items-center bg-gray4 h-[70%] rounded-t-md">
                    <img src={images.playBtn} alt="play" />
                  </div>
                  <div className="bg-white rounded-b-md h-[30%] flex justify-center items-center">
                    <p className="text-primary font-medium">{mooc?.title}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
};

export default MoocDetail;
