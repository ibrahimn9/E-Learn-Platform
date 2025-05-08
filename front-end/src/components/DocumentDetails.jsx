import React, { useState, useEffect } from "react";
import images from "../constants/images";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { ImRadioUnchecked } from "react-icons/im";
import { ImRadioChecked2 } from "react-icons/im";

const DocumentDetails = ({ chapters }) => {
  const [visibleDocuments, setVisibleDocuments] = useState({});

  const toggleDocumentVisibility = (chapterId) => {
    setVisibleDocuments((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  const [FinishedDocuments, setFinishedDocuments] = useState({});

  const toggleDocumentFinished = (docId) => {
    setFinishedDocuments((prevState) => ({
      ...prevState,
      [docId]: !prevState[docId],
    }));
  };

  useEffect(() => {
    if (chapters?.length > 0) {
      const firstElementId = chapters[0].id;
      setVisibleDocuments((prevState) => ({
        ...prevState,
        [firstElementId]: true,
      }));
    }
  }, [chapters]);

  if (chapters?.length > 0)
    return (
      <div className="bg-white p-6 pr-12 mt-4 rounded-md min-h-[500px]">
        {chapters?.map((chapter, index) => (
          <div key={index} className="mt-2 ml-3">
            <div
              onClick={() => toggleDocumentVisibility(chapter?.id)}
              className="flex items-center gap-2 text-primary cursor-pointer"
            >
              {visibleDocuments[chapter?.id] ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
              <p className="text-2xl font-medium">{chapter?.title}</p>
            </div>
            {visibleDocuments[chapter?.id] &&
              chapter.documents.map((doc, index) => (
                <div
                  key={index}
                  className="mt-4 ml-6 border border-gray4 rounded-md flex px-8 py-4 justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <a
                      href={`http://localhost:3000/${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={images.file}
                        className="cursor-pointer"
                        alt="file"
                      />
                    </a>
                    <a
                      href={`http://localhost:3000/${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="cursor-pointer">
                        <p className="text-gray">Document</p>
                        <p className="text-primary">{doc.title}</p>
                      </div>
                    </a>
                  </div>
                  {FinishedDocuments[doc.id] ? (
                    <button
                      onClick={() => toggleDocumentFinished(doc.id)}
                      className="flex justify-center h-8 items-center w-[120px] bg-[#57D9A3] border border-[#57D9A3]  text-white text-sm  rounded-md hover:opacity-[0.8]"
                    >
                      Finished
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleDocumentFinished(doc.id)}
                      className="flex justify-center h-8 items-center w-[120px] bg-gray4 border border-gray4  text-white text-sm  rounded-md hover:opacity-[0.8]"
                    >
                      Mark as finished
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
};

export default DocumentDetails;
