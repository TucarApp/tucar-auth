import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();
  const { redirect_uri } = router.query; // Capturamos el redirect_uri de los query params
  console.log(redirect_uri, 'this is the redirect_uri')

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Si existe redirect_uri, lo pasamos como parámetro a la API de logout
        const apiUrl = redirect_uri
          ? `/api/logout?redirect_uri=${encodeURIComponent(redirect_uri)}`
          : '/api/logout';

        // Enviamos una solicitud GET a la API de logout
        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        // Verificamos si la solicitud fue exitosa
        if (response.ok && !redirect_uri) {
          // Redirigir al home si no existe redirect_uri
          router.push('/');
        }
        console.log(redirect_uri, 'dentro del async')
      } catch (error) {
        console.error('Error durante el logout:', error);
      }
    };

    logoutUser();
  }, [router, redirect_uri]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
