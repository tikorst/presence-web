import { useEffect } from "react";

const getTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return payload.exp * 1000; 
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const useAutoLogout = () => {
  useEffect(() => {
    const expirationTime = getTokenExpiration();
    if (!expirationTime) return;

    const timeLeft = expirationTime - Date.now();
    if (timeLeft > 0) {
      console.log(`Token expires in ${timeLeft / 1000} seconds`);
      setTimeout(() => {
        console.log("Token expired, refreshing...");
        window.location.reload();
      }, timeLeft);
    }
  }, []);
};

export default useAutoLogout;
