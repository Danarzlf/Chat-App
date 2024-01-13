import { createContext, useCallback, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("USERR", user);
  // console.log("loginInfo", loginInfo);
  // console.log("registerInfo", registerInfo);
  // console.log("registerError", registerError);

  //protecting route agar kalo direfresh data user tetep ada
  //pakai local
  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);

  //pakai cookie
  // useEffect(() => {
  //   const user = Cookies.get("User");
  //   // console.log("User dari Cookie:", user);

  //   try {
  //     const parsedUser = JSON.parse(user);
  //     setUser(parsedUser);
  //   } catch (error) {
  //     console.error("Error saat parsing user:", error);
  //     // Handle error disini, seperti menetapkan state pengguna default atau menghapus cookie
  //   }
  // }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      // Simpan ke Cookie
      // Cookies.set("User", JSON.stringify(response));

      // Simpan ke Local Storage
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);

      if (response.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,

        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,

        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
