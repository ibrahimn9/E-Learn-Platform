import { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [resetToken, setResetToken] = useState()

  return (
    <Context.Provider value={{ userData, setUserData }}>
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
