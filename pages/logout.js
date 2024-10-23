import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

const Logout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_uri = searchParams.get('redirect_uri');

  useEffect(() => {
    const logoutUser = async () => {
      try {

        const apiUrl = redirect_uri
          ? `/api/logout?redirect_uri=${encodeURIComponent(redirect_uri)}`
          : '/api/logout';


        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        if (response.ok) {
          if (redirect_uri) {

            router.push(redirect_uri);
          } else {

            router.push('/');
          }
        } else {
          console.error('Error en la solicitud de logout');
        }
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
