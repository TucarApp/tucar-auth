import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  const tucar = 'https://tucar.app'

  console.log('logout')
  useEffect(() => {
    // Llamar a la API de logout para eliminar la cookie
    const logoutUser = async () => {
        
      try {
        console.log('borrando')
        await fetch('/api/logout', {
          method: 'POST',
        });
        console.log('esto es en el await')
        // Redirigir al home después de eliminar la cookie
        router.push(tucar);
      } catch (error) {
        console.error('Error durante el logout:', error);
      } 

    };

    logoutUser();
  }, [router]);
  console.log(tucar)
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
