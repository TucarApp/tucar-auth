import { useEffect } from "react";

const UberAccess = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      localStorage.setItem("uberCode", code);
      window.close(); // Cerrar la ventana emergente
    } else {
      window.close();
    }
  }, []);

  return <p>Procesando flujo de Uber...</p>;
};

export default UberAccess;
