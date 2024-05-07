import { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [userData, setUserData] = useState({});

  //admin
  const [refetchTeachers, setRefetchTeachers] = useState(false);
  const [refetchStudents, setRefetchStudents] = useState(false);
  const [refetchCohorts, setRefetchCohorts] = useState(false);
  const [refetchModules, setRefetchModules] = useState(false);
  const [refetchTModules, setRefetchTModules] = useState(false);

  //teacher
  const [selectedItem, setSelectedItem] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <Context.Provider
      value={{
        userData,
        setUserData,
        refetchTeachers,
        setRefetchTeachers,
        refetchStudents,
        setRefetchStudents,
        refetchCohorts,
        setRefetchCohorts,
        refetchModules,
        setRefetchModules,
        selectedItem,
        setSelectedItem,
        refetchTModules,
        setRefetchTModules,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
