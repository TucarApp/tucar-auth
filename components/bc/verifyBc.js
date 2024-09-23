import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Verify = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(6); // Inicializamos el contador en 6 segundos

  useEffect(() => {
    // Iniciamos el intervalo para contar los segundos
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000); // Cada segundo

    // Redirige al dashboard después de que el contador llegue a 0
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 6000); // 6 segundos

    // Limpiar el intervalo y el timeout al desmontar el componente
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  // Función para saltar el timeout y redirigir de inmediato
  const skipTimeout = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <h1 className="text-2xl font-bold">¡Gracias por registrarte!</h1>
      <p>Estamos verificando tu autenticación...</p>
      <p>Esta ventana se cerrará en {timeLeft} segundos</p>

      {/* Botón para saltar el timeout */}
      <button
        onClick={skipTimeout}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Saltar y continuar ahora
      </button>
    </div>
  );
};

export default Verify;
