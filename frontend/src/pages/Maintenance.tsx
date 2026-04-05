import { useEffect } from "react";

const Maintenance = () => {
  useEffect(() => {
    // Redirect to home
    window.location.href = "/";
  }, []);

  return null;
};

export default Maintenance;
