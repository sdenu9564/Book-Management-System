import { createContext, useState } from "react";

export const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  // Check if localStorage is available before accessing it
  // const storedAccount = typeof localStorage !== "undefined" ? JSON.parse(localStorage?.getItem("account")) : null;

  const [account, setAccount] = useState(null);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
