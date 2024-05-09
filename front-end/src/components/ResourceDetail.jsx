import React, { useState, useEffect } from "react";
import { RiPlayList2Fill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLink } from "react-icons/fa";

import images from "../constants/images";

const ResourceDetail = ({ resources }) => {
  const types = [
    { name: "ytVd", icon: <FaYoutube /> },
    { name: "ytPl", icon: <RiPlayList2Fill /> },
    { name: "ytCh", icon: <BiSolidUserRectangle /> },
    { name: "ot", icon: <FaLink /> },
  ];

  return (
    <div className="mt-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
        {resources.map((resource, index) => (
          <div key={index} className="relative">
            <div className="absolute flex justify-center items-center w-[50px] h-[50px] rounded-full bg-primary text-white text-[25px] left-[95%] top-0 translate-x-[-50%] translate-y-[-50%]">
              {types.find((type) => type.name === resource.type)?.icon}
            </div>
            <div className="bg-blueState rounded-t-md p-4 h-1/2 w-full">
              <a href={resource.link} target="_blank">
                <p className="text-white underline cursor-pointer max-w-[85%] break-words">
                  {resource.link}
                </p>
              </a>
            </div>
            <div className="bg-white rounded-b-md p-4 h-1/2 w-full">
              <p>{resource.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceDetail;
