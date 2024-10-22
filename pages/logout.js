import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Llamar a la API de logout para eliminar la cookie
    const logoutUser = async () => {
      try {
        await fetch('/api/logout', {
          method: 'POST',
        });

        // Redirigir al home después de eliminar la cookie
        router.push('/');
      } catch (error) {
        console.error('Error durante el logout:', error);
      }
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
