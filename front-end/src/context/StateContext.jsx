import { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [refetchTeachers, setRefetchTeachers] = useState(false);
  const [refetchStudents, setRefetchStudents] = useState(false);

  return (
    <Context.Provider value={{ userData, setUserData, refetchTeachers, setRefetchTeachers, refetchStudents, setRefetchStudents }}>
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
