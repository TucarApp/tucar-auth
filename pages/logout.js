import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

const Logout = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Obtenemos los parámetros de la URL
  const redirect_uri = searchParams.get('redirect_uri'); // Capturamos el redirect_uri de los query params

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Construimos la URL de la API de logout con o sin redirect_uri
        const apiUrl = redirect_uri
          ? `/api/logout?redirect_uri=${encodeURIComponent(redirect_uri)}`
          : '/api/logout';

        // Enviamos una solicitud GET a la API de logout
        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        // Si la solicitud fue exitosa y no tenemos redirect_uri, redirigimos al home
        if (response.ok) {
          if (redirect_uri) {
            // Si tenemos redirect_uri, hacemos la redirección
            router.push(redirect_uri);
          } else {
            // Si no, redirigimos al home
            router.push('/');
          }
        } else {
          console.error('Error en la solicitud de logout');
        }
      } catch (error) {
        console.error('Error durante el logout:', error);
      }
    };

    // Ejecutamos el logout
    logoutUser();
  }, [router, redirect_uri]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
